package models

import "gorm.io/gorm"

// CollaborationOrderItem represents individual line items in a collaboration order
// This allows multiple products in a single group order
type CollaborationOrderItem struct {
    gorm.Model
    CollaborationOrderID uint    `json:"collaboration_order_id" gorm:"not null;index"`
    ProductID           uint    `json:"product_id" gorm:"not null;index"`
    Quantity            int     `json:"quantity" gorm:"not null"`
    UnitPrice          float64 `json:"unit_price" gorm:"not null"`
    TotalPrice         float64 `json:"total_price" gorm:"not null"`
    Status             string  `json:"status" gorm:"default:'pending'"` // pending, confirmed, delivered
    
    // Relationships (optional - uncomment when you need them)
    // CollaborationOrder CollaborationOrder `json:"collaboration_order,omitempty" gorm:"foreignKey:CollaborationOrderID"`
    // Product           Product           `json:"product,omitempty" gorm:"foreignKey:ProductID"`
}

// TableName specifies the table name for CollaborationOrderItem
func (CollaborationOrderItem) TableName() string {
    return "collaboration_order_items"
}

// BeforeCreate hook to calculate total price automatically
func (coi *CollaborationOrderItem) BeforeCreate(tx *gorm.DB) error {
    if coi.TotalPrice == 0 {
        coi.TotalPrice = float64(coi.Quantity) * coi.UnitPrice
    }
    return nil
}

// BeforeUpdate hook to recalculate total price when quantity or unit price changes
func (coi *CollaborationOrderItem) BeforeUpdate(tx *gorm.DB) error {
    coi.TotalPrice = float64(coi.Quantity) * coi.UnitPrice
    return nil
}