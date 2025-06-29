package db

import (
    "fmt"
    "os"
    "github.com/kaichewy/GoShare/backend/models"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
    host := os.Getenv("DB_HOST")
    port := os.Getenv("DB_PORT")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")

    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Singapore",
        host, user, password, dbname, port,
    )

    var err error
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to DB: " + err.Error())
    }

    // Add your new models to existing migration
    err = DB.AutoMigrate(
        &models.User{},
        &models.Product{},
        &models.CollaborationOrder{},
        &models.DeliveryRoute{},
    )
    if err != nil {
        panic("Failed to migrate models: " + err.Error())
    }

    // Seed product data for testing
    seedProductData()

    fmt.Print("Database connected! :)")
}

// Add seed function for your product data
func seedProductData() {
    // Check if products already exist
    var count int64
    DB.Model(&models.Product{}).Count(&count)
    
    if count == 0 {
        // Create sample product
        product := models.Product{
            Name:        "Premium Copy Paper",
            Description: "Professional grade A4 white copy paper",
            BasePrice:   12.50,
            Supplier:    "PaperWorks Solutions",
            ImageURL:    "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
        }
        DB.Create(&product)

        // Create sample collaboration orders
        orders := []models.CollaborationOrder{
            {
                ProductID:      1,
                BusinessName:   "Metro Cafe Chain",
                Quantity:       6,
                TargetQuantity: 10,
                Status:         "active",
                DeliveryDate:   "Tuesday",
                Location:       "Downtown",
            },
            {
                ProductID:      1,
                BusinessName:   "Bright Start Academy",
                Quantity:       18,
                TargetQuantity: 25,
                Status:         "active",
                DeliveryDate:   "Thursday",
                Location:       "Westside",
            },
        }

        for _, order := range orders {
            DB.Create(&order)
        }

        fmt.Println("Sample product data seeded!")
	}
}
