package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadProductImage menangani proses upload foto produk
func UploadProductImage(c *gin.Context) {
	// 1. Mengambil file dari request form-data dengan key "image"
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal mengambil file gambar"})
		return
	}

	// 2. Membuat nama file unik menggunakan timestamp agar tidak bentrok
	// Contoh hasil: 1715851234_nastar-keju.jpg
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))

	// 3. Tentukan lokasi penyimpanan fisik
	dst := filepath.Join("uploads", "products", filename)

	// 4. Simpan file ke folder destination
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file ke server"})
		return
	}

	// 5. Kembalikan path URL-nya untuk disimpan ke Database nantinya
	// Gunakan slash (/) agar kompatibel dengan URL web
	urlPath := fmt.Sprintf("uploads/products/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"message":   "Upload berhasil",
		"image_url": urlPath,
	})
}
