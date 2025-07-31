package db

import (
	"github.com/kaichewy/GoShare/backend/models"
)

func SeedProducts() {
	// Check if products already exist
	var count int64
	DB.Model(&models.Product{}).Count(&count)
	if count > 0 {
		return // Already seeded
	}

	products := []models.Product{
		{
			Name:        "iPhone 15 Pro",
			Description: "Latest iPhone with advanced camera system and A17 Pro chip",
			Price:       1199.99,
			BasePrice:   1199.99,
			Quantity:    50,
			Category:    "Electronics",
			Supplier:    "Apple",
			ImageURL:    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
		},
		{
			Name:        "MacBook Pro 16",
			Description: "Professional laptop with M3 Pro chip and 16-inch Retina display",
			Price:       2499.99,
			BasePrice:   2499.99,
			Quantity:    30,
			Category:    "Electronics",
			Supplier:    "Apple",
			ImageURL:    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
		},
		{
			Name:        "AirPods Pro",
			Description: "Wireless earbuds with active noise cancellation",
			Price:       249.99,
			BasePrice:   249.99,
			Quantity:    100,
			Category:    "Electronics",
			Supplier:    "Apple",
			ImageURL:    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
		},
		{
			Name:        "iPad Air",
			Description: "Powerful tablet with M2 chip and 10.9-inch Liquid Retina display",
			Price:       599.99,
			BasePrice:   599.99,
			Quantity:    75,
			Category:    "Electronics",
			Supplier:    "Apple",
			ImageURL:    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
		},
		{
			Name:        "Apple Watch Series 9",
			Description: "Smartwatch with health monitoring and fitness tracking",
			Price:       399.99,
			BasePrice:   399.99,
			Quantity:    60,
			Category:    "Electronics",
			Supplier:    "Apple",
			ImageURL:    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
		},
		{
			Name:        "Samsung Galaxy S24 Ultra",
			Description: "Premium Android smartphone with S Pen and advanced camera",
			Price:       1199.99,
			BasePrice:   1199.99,
			Quantity:    40,
			Category:    "Electronics",
			Supplier:    "Samsung",
			ImageURL:    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
		},
		{
			Name:        "Premium Copy Paper",
			Description: "High-quality A4 paper for professional printing",
			Price:       0.00,
			BasePrice:   0.00,
			Quantity:    200,
			Category:    "Office Supplies",
			Supplier:    "OfficeMax",
			ImageURL:    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop",
		},
		{
			Name:        "Test Product",
			Description: "A test product for development purposes",
			Price:       99.99,
			BasePrice:   99.99,
			Quantity:    25,
			Category:    "Test",
			Supplier:    "Test Supplier",
			ImageURL:    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop",
		},
	}

	for _, product := range products {
		DB.Create(&product)
	}
} 