package models

import (
	"gorm.io/gorm"
)

type Group struct {
	gorm.Model
	Name         string `gorm:"not null"`
	ImageURL     string
	ProductID    string `gorm:"not null"`
	Joined       int    `gorm:"not null"`
	CostCurrent  int    `gorm:"not null"`
	CostRequired int    `gorm:"not null"`
}

//Product assumed to have fields : image(url), name, reviews, bought, total
