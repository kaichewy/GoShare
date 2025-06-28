package controllers

import (
    "github.com/gin-gonic/gin"
)

// Ping godoc
// @Summary Health check
// @Description Check if the server is running
// @Tags health
// @Produce json
// @Success 200 {object} map[string]string
// @Router /ping [get]
func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "ok",
		"message": "the backend is working dude",
	})
}