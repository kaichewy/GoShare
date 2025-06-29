package models

import "gorm.io/gorm"

type Product struct {
    gorm.Model
    Name        string  `gorm:"not null" json:"name"`
    Description string  `gorm:"not null" json:"description"`
    Price       float64 `gorm:"not null" json:"price"`          // For controller
    BasePrice   float64 `gorm:"not null" json:"base_price"`     // For db seeding
    Quantity    int     `gorm:"not null" json:"quantity"`       // For controller
    Category    string  `gorm:"not null" json:"category"`       // For controller
    Supplier    string  `json:"supplier"`                       // For db seeding
    ImageURL    string  `gorm:"not null" json:"image_url"`
}