package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name string `gorm:"not null"`
	Description string `gorm:"not null"`
	Price float64 `gorm:"not null"`
	Quantity int `gorm:"not null"`
	Category string `gorm:"not null"`
	ImageURL string `gorm:"not null"`
}