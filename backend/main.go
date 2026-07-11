package main

import (
	"os"
	"risa-resa-cookies/backend/config"
	"risa-resa-cookies/backend/database"
	"risa-resa-cookies/backend/routes"
)

func main() {
	config.ConnectDatabase()

	database.ResetAndSeed()

	r := routes.SetupRouter()

	// Menghubungkan folder fisik ke path URL agar bisa diakses secara publik
	r.Static("/uploads", "./uploads")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
