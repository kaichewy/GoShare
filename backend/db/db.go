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

	err = DB.AutoMigrate(&models.User{}, &models.Product{})

	if err != nil {
		panic("Failed to migrate models: " + err.Error())
	}

	fmt.Print("Database connected! :)")
}