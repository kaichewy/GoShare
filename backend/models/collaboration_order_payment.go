package models

import (
    "time"
    "gorm.io/gorm"
)

// CollaborationOrderPayment represents payment transactions for collaboration orders
// This handles payment splitting among group members
type CollaborationOrderPayment struct {
    gorm.Model
    CollaborationOrderID uint      `json:"collaboration_order_id" gorm:"not null;index"`
    UserID              uint      `json:"user_id" gorm:"not null;index"`
    Amount              float64   `json:"amount" gorm:"not null"`
    Status              string    `json:"status" gorm:"default:'pending'"` // pending, processing, completed, failed, refunded
    PaymentMethod       string    `json:"payment_method" gorm:"not null"`  // credit_card, bank_transfer, paypal, etc.
    TransactionID       string    `json:"transaction_id" gorm:"uniqueIndex"` // External payment processor transaction ID
    PaymentDate         *time.Time `json:"payment_date"`
    FailureReason       string    `json:"failure_reason,omitempty"`
    RefundAmount        float64   `json:"refund_amount" gorm:"default:0"`
    RefundDate          *time.Time `json:"refund_date"`
    
    // Payment processor specific fields
    ProcessorResponse   string    `json:"processor_response,omitempty"` // Store raw response from payment processor
    Currency           string    `json:"currency" gorm:"default:'USD'"`
    
    // Relationships (optional - uncomment when you need them)
    // CollaborationOrder CollaborationOrder `json:"collaboration_order,omitempty" gorm:"foreignKey:CollaborationOrderID"`
    // User              User              `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// TableName specifies the table name for CollaborationOrderPayment
func (CollaborationOrderPayment) TableName() string {
    return "collaboration_order_payments"
}

// BeforeCreate hook to set payment date when status becomes completed
func (cop *CollaborationOrderPayment) BeforeCreate(tx *gorm.DB) error {
    if cop.Status == "completed" && cop.PaymentDate == nil {
        now := time.Now()
        cop.PaymentDate = &now
    }
    return nil
}

// BeforeUpdate hook to set payment date when status changes to completed
func (cop *CollaborationOrderPayment) BeforeUpdate(tx *gorm.DB) error {
    if cop.Status == "completed" && cop.PaymentDate == nil {
        now := time.Now()
        cop.PaymentDate = &now
    }
    return nil
}

// MarkAsCompleted helper method to mark payment as completed
func (cop *CollaborationOrderPayment) MarkAsCompleted(transactionID string) {
    cop.Status = "completed"
    cop.TransactionID = transactionID
    now := time.Now()
    cop.PaymentDate = &now
}

// MarkAsFailed helper method to mark payment as failed
func (cop *CollaborationOrderPayment) MarkAsFailed(reason string) {
    cop.Status = "failed"
    cop.FailureReason = reason
}

// ProcessRefund helper method to process a refund
func (cop *CollaborationOrderPayment) ProcessRefund(amount float64) {
    cop.RefundAmount = amount
    cop.Status = "refunded"
    now := time.Now()
    cop.RefundDate = &now
}