package controllers

import (
	"errors"
	"net/http"
	"strconv" // package that converts string to int

	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"     // import database
	"github.com/kaichewy/GoShare/backend/models" // import User model
	"github.com/kaichewy/GoShare/backend/responses"
	"github.com/kaichewy/GoShare/backend/utils"
	"gorm.io/gorm"
)

// GetUserInfo godoc
// @Summary      Get user information
// @Description  Retrieve user details by their ID
// @Tags         users
// @Produce      json
// @Param        id   path      int  true  "User ID"
// @Success 200 {object} responses.UserResponse "User data"
// @Failure 404 {object} utils.CustomError "user not found"
// @Failure 500 {object} utils.CustomError "database error"
// @Security     ApiKeyAuth
// @Router       /user/{id} [get]
func GetUserInfo(c *gin.Context) {
	idStr := c.Params.ByName("id") // assign user id to idStr
	id, _ := strconv.Atoi(idStr) // convert id param to int
	
	var user models.User

	result := db.DB.First(&user, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		errResp := utils.New(errors.New("user not found"), http.StatusNotFound)
        c.JSON(http.StatusNotFound, errResp)
        return
    } else if result.Error != nil {
        errResp := utils.New(errors.New("database error"), http.StatusInternalServerError).WithDetails(result.Error.Error())
		c.JSON(http.StatusInternalServerError, errResp)
        return
    }

	response := responses.UserResponse{
		ID: user.ID,
		Name: user.Name,
		Email: user.Email,
	}

    // You can send the entire user struct if it’s safe
    c.JSON(http.StatusOK, response)
}