package controllers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "github.com/kaichewy/GoShare/backend/db"
    "github.com/kaichewy/GoShare/backend/models"
)

func GetProduct(c *gin.Context) {
    idStr := c.Params.ByName("id")
    id, err := strconv.Atoi(idStr)
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }
    
    var product models.Product
    result := db.DB.First(&product, id)
    
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }
    
    c.JSON(http.StatusOK, product)
}

func GetCollaborationOrders(c *gin.Context) {
    idStr := c.Params.ByName("id")
    productID, err := strconv.Atoi(idStr)
    
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }
    
    var orders []models.CollaborationOrder
    db.DB.Where("product_id = ? AND status = ?", productID, "active").Find(&orders)
    
    c.JSON(http.StatusOK, orders)
}

func CreateNewOrder(c *gin.Context) {
    var order models.CollaborationOrder
    
    if err := c.ShouldBindJSON(&order); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }
    
    db.DB.Create(&order)
    c.JSON(http.StatusOK, gin.H{"message": "Order created successfully", "order": order})
}

func JoinCollaborationOrder(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Successfully joined collaboration order"})
}