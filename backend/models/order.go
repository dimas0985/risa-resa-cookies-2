package models

import "time"

type Order struct {
	ID            uint        `json:"id" gorm:"primaryKey"`
	UserID        uint        `json:"user_id"`
	User          User        `json:"user"`
	TotalPrice    float64     `json:"total_price"`
	Status        string      `json:"status" gorm:"default:pending"` // pending, paid, shipped, completed, cancelled
	StockApplied  bool        `json:"stock_applied" gorm:"default:false"`
	Address       string      `json:"address"`
	PaymentMethod string      `json:"payment_method"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
	OrderItems    []OrderItem `json:"order_items"`
}

type OrderItem struct {
	ID         uint    `json:"id" gorm:"primaryKey"`
	OrderID    uint    `json:"order_id"`
	ProductID  uint    `json:"product_id"`
	Product    Product `json:"product"`
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	TotalPrice float64 `json:"total_price"`
}
