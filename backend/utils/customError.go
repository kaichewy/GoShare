package utils

import (
	"encoding/json"
)

// CustomError represents a structured error response
type CustomError struct {
	Message string `json:"message"`
	Code    int    `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}

// New creates a new CustomError
func New(err error, code ...int) *CustomError {
	c := &CustomError{
		Message: err.Error(),
	}

	// Set error code if provided
	if len(code) > 0 {
		c.Code = code[0]
	}

	return c
}

// WithDetails adds additional error details
func (c *CustomError) WithDetails(details string) *CustomError {
	c.Details = details
	return c
}

// Error implements the error interface
func (c *CustomError) Error() string {
	return c.Message
}

// ToJSON converts the error to JSON
func (c *CustomError) ToJSON() []byte {
	jsonData, _ := json.Marshal(c)
	return jsonData
}