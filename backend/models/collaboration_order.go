package models
import "gorm.io/gorm"

type CollaborationOrder struct {
    gorm.Model
    ProductID      uint   `json:"product_id"`
    BusinessName   string `json:"business_name"`
    Quantity       int    `json:"quantity"`
    TargetQuantity int    `json:"target_quantity"`
    Status         string `json:"status"`
    DeliveryDate   string `json:"delivery_date"`
    Location       string `json:"location"`
}