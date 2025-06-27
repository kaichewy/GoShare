package controllers

import (
	"errors"
	"net/http"
	"strconv" // package that converts string to int
	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"     // import database
	"github.com/kaichewy/GoShare/backend/models" // import User model
	"gorm.io/gorm"
)

// GetUserInfo godoc
// @Summary      Get user information
// @Description  Retrieve user details by their ID
// @Tags         users
// @Produce      json
// @Param        id   path      int  true  "User ID"
// @Success      200  {object}  gin.H
// @Security     ApiKeyAuth
// @Router       /user/{id} [get]
func GetUserInfo(c *gin.Context) {
	idStr := c.Params.ByName("id") // assign user id to idStr
	id, _ := strconv.Atoi(idStr) // convert id param to int
	
	var user models.User

	result := db.DB.First(&user, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    } else if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
        return
    }

    // You can send the entire user struct if it’s safe
    c.JSON(http.StatusOK, user)
}