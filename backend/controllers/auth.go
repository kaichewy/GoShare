package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"
	"github.com/kaichewy/GoShare/backend/models"
	// "github.com/kaichewy/GoShare/backend/utils"
)

func Login(c *gin.Context) {
	var req models.LoginRequest
	err := c.ShouldBindJSON(&req)

	// if we cannot obtain json req, throw error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON format",
		})
		return
	}

	// check if user exists
	user_info, exists := db.UsersByEmail[req.Email]

	if (!exists) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No such user",
		})
		return
	}
	
	// check if correct password was entered
	attempted_password := req.Password
	correct_password := user_info.Password

	// if (utils.CheckPasswordHash(attempted_password, correct_password)) {
	// 	log.Println("logged in successfully")
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"message": "Login successful",
	// 	})
	// } else {
	// 	c.JSON(http.StatusUnauthorized, gin.H{
	// 		"error": "Invalid password",
	// 	})
	// }
	
	// temporarily use un-hashed password
	if (attempted_password == correct_password) {
		log.Println("logged in successfully")
		c.JSON(http.StatusOK, gin.H{
			"message": "Login successful",
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid password",
		})
	}
}