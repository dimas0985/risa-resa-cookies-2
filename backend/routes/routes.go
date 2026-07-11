package routes

import (
	"risa-resa-cookies/backend/controllers"
	"risa-resa-cookies/backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// CORS
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	r.Use(cors.New(config))

	// Public routes
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)
	r.GET("/products", controllers.GetProducts)
	r.GET("/products/:id", controllers.GetProduct)

	// Protected routes
	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	{
		auth.POST("/orders", controllers.CreateOrder)
		auth.GET("/orders", controllers.GetMyOrders)
	}

	// Admin routes
	admin := r.Group("/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
	{
		admin.POST("/products", controllers.CreateProduct)
		admin.PUT("/products/:id", controllers.UpdateProduct)
		admin.DELETE("/products/:id", controllers.DeleteProduct)
		admin.POST("/products/upload", controllers.UploadProductImage)
		admin.GET("/orders", controllers.GetAllOrders)
		admin.PUT("/orders/:id", controllers.UpdateOrder)
		admin.DELETE("/orders/:id", controllers.DeleteOrder)
		admin.GET("/users", controllers.GetUsers)
	}

	return r
}
