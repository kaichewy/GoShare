package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"github.com/kaichewy/GoShare/backend/db" // import database
	"strconv" // package that converts string to int
)

func GetUserInfo(c *gin.Context) {
	idStr := c.Params.ByName("id") // assign user id to idStr
	id, _ := strconv.Atoi(idStr) // convert id param to int
	value, ok := db.Users[id]
	if ok {
		c.JSON(http.StatusOK, gin.H{"id": id, "value": value})
	} else {
		c.JSON(http.StatusOK, gin.H{"id": id, "status": "no value"})
	}
}