package models

import (
    "time"
    "gorm.io/gorm"
)

// Group represents a collaborative buying group
type Group struct {
    ID              uint           `json:"id" gorm:"primaryKey"`
    Name            string         `json:"name" gorm:"size:255;not null"`
    ProductID       uint           `json:"product_id" gorm:"not null;index"`
    BusinessName    string         `json:"business_name" gorm:"size:255;not null"`
    CurrentQuantity int            `json:"current_quantity" gorm:"default:0"`
    TargetQuantity  int            `json:"target_quantity" gorm:"not null"`
    Location        string         `json:"location" gorm:"size:255"`
    DeliveryDate    string         `json:"delivery_date" gorm:"size:255"`
    Description     string         `json:"description" gorm:"type:text"`
    CreatedBy       uint           `json:"created_by" gorm:"not null;index"`
    CreatedAt       time.Time      `json:"created_at"`
    UpdatedAt       time.Time      `json:"updated_at"`
    DeletedAt       gorm.DeletedAt `json:"-" gorm:"index"`
}

// GroupMember represents a user's membership in a group
type GroupMember struct {
    ID       uint           `json:"id" gorm:"primaryKey"`
    GroupID  uint           `json:"group_id" gorm:"not null;index;uniqueIndex:idx_group_user"`
    UserID   uint           `json:"user_id" gorm:"not null;index;uniqueIndex:idx_group_user"`
    Quantity int            `json:"quantity" gorm:"default:1"`
    JoinedAt time.Time      `json:"joined_at"`
    DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}