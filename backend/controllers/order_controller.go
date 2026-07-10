package controllers

import (
	"errors"
	"net/http"
	"risa-resa-cookies/backend/config"
	"risa-resa-cookies/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

var errInsufficientStock = errors.New("stok produk tidak mencukupi")

func CreateOrder(c *gin.Context) {
	var input struct {
		Address       string `json:"address" binding:"required"`
		PaymentMethod string `json:"payment_method" binding:"required"`
		Items         []struct {
			ProductID uint `json:"product_id" binding:"required"`
			Quantity  int  `json:"quantity" binding:"required"`
		} `json:"items" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var order models.Order

	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		var totalPrice float64
		orderItems := make([]models.OrderItem, 0, len(input.Items))

		for _, item := range input.Items {
			if item.Quantity <= 0 {
				return gorm.ErrInvalidData
			}

			var product models.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&product, item.ProductID).Error; err != nil {
				return err
			}

			if product.Stock < item.Quantity {
				return errInsufficientStock
			}

			itemTotal := product.Price * float64(item.Quantity)
			totalPrice += itemTotal

			orderItems = append(orderItems, models.OrderItem{
				ProductID:  product.ID,
				Quantity:   item.Quantity,
				Price:      product.Price,
				TotalPrice: itemTotal,
			})
		}

		order = models.Order{
			UserID:        currentUser.ID,
			TotalPrice:    totalPrice,
			Address:       input.Address,
			PaymentMethod: input.PaymentMethod,
			Status:        "pending",
			StockApplied:  false,
			OrderItems:    orderItems,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		return nil
	}); err != nil {
		if errors.Is(err, errInsufficientStock) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Stok produk tidak mencukupi"})
			return
		}

		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Produk tidak ditemukan"})
			return
		}

		if errors.Is(err, gorm.ErrInvalidData) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Jumlah produk tidak valid"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func GetMyOrders(c *gin.Context) {
	user, _ := c.Get("user")
	currentUser := user.(models.User)

	var orders []models.Order
	config.DB.Preload("OrderItems.Product").Where("user_id = ?", currentUser.ID).Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func GetAllOrders(c *gin.Context) {
	var orders []models.Order
	config.DB.Preload("User").Preload("OrderItems.Product").Find(&orders)
	c.JSON(http.StatusOK, orders)
}

func UpdateOrder(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status        string `json:"status" binding:"required"`
		Address       string `json:"address"`
		PaymentMethod string `json:"payment_method"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	allowedStatuses := map[string]bool{
		"pending":   true,
		"paid":      true,
		"shipped":   true,
		"completed": true,
		"cancelled": true,
	}

	if !allowedStatuses[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status pesanan tidak valid"})
		return
	}

	var order models.Order
	if err := config.DB.Preload("OrderItems").First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pesanan tidak ditemukan"})
		return
	}

	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		confirmedStatus := input.Status == "paid" || input.Status == "shipped" || input.Status == "completed"
		if confirmedStatus && !order.StockApplied {
			if err := applyOrderStock(tx, order.OrderItems, -1); err != nil {
				return err
			}
			order.StockApplied = true
		}

		if input.Status == "cancelled" && order.StockApplied {
			if err := applyOrderStock(tx, order.OrderItems, 1); err != nil {
				return err
			}
			order.StockApplied = false
		}

		order.Status = input.Status
		if input.Address != "" {
			order.Address = input.Address
		}
		if input.PaymentMethod != "" {
			order.PaymentMethod = input.PaymentMethod
		}

		return tx.Save(&order).Error
	}); err != nil {
		if errors.Is(err, errInsufficientStock) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Stok produk tidak mencukupi"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui pesanan"})
		return
	}

	config.DB.Preload("User").Preload("OrderItems.Product").First(&order, order.ID)
	c.JSON(http.StatusOK, order)
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")

	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.Preload("OrderItems").First(&order, id).Error; err != nil {
			return err
		}

		if order.StockApplied {
			if err := applyOrderStock(tx, order.OrderItems, 1); err != nil {
				return err
			}
		}

		if err := tx.Where("order_id = ?", order.ID).Delete(&models.OrderItem{}).Error; err != nil {
			return err
		}

		return tx.Delete(&order).Error
	}); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Pesanan tidak ditemukan"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus pesanan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pesanan berhasil dihapus"})
}

func applyOrderStock(tx *gorm.DB, items []models.OrderItem, direction int) error {
	for _, item := range items {
		var product models.Product
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&product, item.ProductID).Error; err != nil {
			return err
		}

		stockChange := item.Quantity * direction
		if product.Stock+stockChange < 0 {
			return errInsufficientStock
		}

		product.Stock += stockChange
		if err := tx.Save(&product).Error; err != nil {
			return err
		}
	}

	return nil
}
