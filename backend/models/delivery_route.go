package models

import "gorm.io/gorm"

type DeliveryRoute struct {
    gorm.Model
    Name        string `json:"name"`
    Description string `json:"description"`
}