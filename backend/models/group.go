package models

import (
    "gorm.io/gorm"
)

type Group struct {
    gorm.Model
    Name        string    `gorm:"not null"` // e.g., "Friday Lunch Group"
    ProductID   uint      `gorm:"not null"` // FK to Product
    Members     []User    `gorm:"many2many:group_members;"`
}
