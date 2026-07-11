package database

import (
	"os"
	"risa-resa-cookies/backend/config"
	"risa-resa-cookies/backend/models"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type seedProduct struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	Image       string
}

var seedProducts = []seedProduct{
	{"Nastar Keju", "Nastar klasik dengan isian nanas manis dan taburan keju gurih.", 85000, 25, "uploads/products/Nastar-Keju.jpg"},
	{"Nastar Keju Special", "Nastar premium dengan rasa keju yang lebih kaya untuk hampers dan sajian lebaran.", 95000, 20, "uploads/products/Nastar-Keju-Special.jpg"},
	{"Nastar Keju Rombutter", "Nastar lembut dengan aroma butter yang harum dan tekstur lumer.", 105000, 18, "uploads/products/Nastar-Keju-Rombutter.jpg"},
	{"Nastar Daun Special", "Nastar bentuk daun yang cantik dengan rasa nanas legit dan adonan premium.", 95000, 16, "uploads/products/Nastar-Daun-Special.jpg"},
	{"Kastengel Special", "Kue keju renyah dengan rasa gurih yang cocok untuk suguhan keluarga.", 98000, 22, "uploads/products/Kastengel-Special.jpg"},
	{"Kastengel Rombutter", "Kastengel dengan butter premium, renyah, wangi, dan gurih.", 108000, 18, "uploads/products/Kastengel-Rombutter.jpg"},
	{"Putri Salju Rombutter", "Putri salju lembut bertabur gula halus dengan aroma butter yang khas.", 90000, 24, "uploads/products/Putri-Salju-Rombutter.jpg"},
	{"Sagu Keju Rombutter", "Sagu keju ringan, lumer, dan harum untuk teman minum teh.", 88000, 21, "uploads/products/Sagu-Keju-Rombutter.jpg"},
	{"Lidah Kucing Rombutter", "Lidah kucing tipis dan renyah dengan cita rasa butter premium.", 82000, 20, "uploads/products/Lidah-Kucing-Rombutter.jpg"},
	{"Semprit Coklat", "Semprit coklat renyah dengan rasa manis yang pas.", 78000, 26, "uploads/products/Semprit-Coklat.jpg"},
	{"Semprot Nanas", "Kue semprot dengan sentuhan nanas yang segar dan manis.", 78000, 19, "uploads/products/Semprot-Nanas.jpg"},
	{"Choco Chip Rombutter", "Cookies renyah dengan choco chip melimpah dan aroma butter.", 88000, 23, "uploads/products/Choco-Chip-Rombutter.jpg"},
	{"Coklat Mede Rombutter", "Cookies coklat dengan kacang mede gurih dan tekstur renyah.", 95000, 17, "uploads/products/Coklat-Mede-Rombutter.jpg"},
	{"Almond Cookies Rombutter", "Cookies almond dengan butter premium, renyah, dan wangi.", 98000, 18, "uploads/products/Almond-Cookies-Rombutter.jpg"},
	{"Jagung Rombutter", "Cookies jagung unik dengan rasa manis gurih dan aroma butter.", 82000, 20, "uploads/products/Jagung-Rombutter.jpg"},
}

func ResetAndSeed() {
	if strings.EqualFold(os.Getenv("DB_RESET_ON_START"), "true") {
		config.DB.Migrator().DropTable(&models.OrderItem{}, &models.Order{}, &models.Product{}, &models.User{})
	}

	config.DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Order{}, &models.OrderItem{})
	seedUsers()
	seedCatalogProducts()
}

func seedUsers() {
	users := []struct {
		Name     string
		Email    string
		Password string
		Role     string
	}{
		{"Owner Risa Resa Cookies", "admin@risaresa.com", "admin123", "admin"},
		{"Pembeli Risa Resa Cookies", "pembeli@risaresa.com", "pembeli123", "customer"},
	}

	for _, item := range users {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(item.Password), bcrypt.DefaultCost)
		user := models.User{
			Name:     item.Name,
			Email:    item.Email,
			Password: string(hashedPassword),
			Role:     item.Role,
		}

		config.DB.Where(models.User{Email: item.Email}).Assign(user).FirstOrCreate(&user)
	}
}

func seedCatalogProducts() {
	for _, item := range seedProducts {
		product := models.Product{
			Name:        item.Name,
			Description: item.Description,
			Price:       item.Price,
			Stock:       item.Stock,
			Image:       item.Image,
		}

		config.DB.Where(models.Product{Name: item.Name}).Assign(product).FirstOrCreate(&product)
	}
}
