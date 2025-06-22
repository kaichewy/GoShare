package controllers

import (
    "github.com/gin-gonic/gin"
)

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "ok",
		"message": "the backend is working dude",
	})
}