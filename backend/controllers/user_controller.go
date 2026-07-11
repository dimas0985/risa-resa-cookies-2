package controllers

import (
	"net/http"
	"os"
	"risa-resa-cookies/backend/config"
	"risa-resa-cookies/backend/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful"})
}

func Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	identifier := strings.TrimSpace(input.Email)
	if identifier == "" {
		identifier = strings.TrimSpace(input.Username)
	}
	if identifier == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email atau nama wajib diisi"})
		return
	}

	var user models.User
	normalizedIdentifier := strings.ToLower(identifier)
	if err := config.DB.Where("LOWER(email) = ? OR LOWER(name) = ?", normalizedIdentifier, normalizedIdentifier).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !passwordMatches(user.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !strings.HasPrefix(user.Password, "$2a$") && !strings.HasPrefix(user.Password, "$2b$") && !strings.HasPrefix(user.Password, "$2y$") {
		if hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost); err == nil {
			config.DB.Model(&user).Update("password", string(hashedPassword))
		}
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString, "user": user})
}

func passwordMatches(storedPassword, inputPassword string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(inputPassword)); err == nil {
		return true
	}

	return storedPassword == inputPassword
}

func GetUsers(c *gin.Context) {
	var users []models.User
	config.DB.Order("created_at desc").Find(&users)
	c.JSON(http.StatusOK, users)
}
