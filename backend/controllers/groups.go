package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"     // import database
	"github.com/kaichewy/GoShare/backend/models" // import User model
)

func GetGroups(c *gin.Context) {
	var groups []models.Group
	if err := db.DB.Find(&groups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch groups"})
		return
	}

	c.JSON(http.StatusOK, groups)
}
