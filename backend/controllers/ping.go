package controllers

import (
    "github.com/gin-gonic/gin"
)

var db = make(map[string]string)

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "ok",
		"message": "the backend is working dude",
	})
}