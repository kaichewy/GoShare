package controllers

import (
	"errors"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"     // import database
	"github.com/kaichewy/GoShare/backend/models" // import User model
	"github.com/kaichewy/GoShare/backend/responses"
	"github.com/kaichewy/GoShare/backend/utils"
	"gorm.io/gorm"
)

// GetMyProfile godoc
// @Summary      Get current authenticated user profile
// @Description  Retrieve the profile information of the currently authenticated user.
// @Tags         users
// @Produce      json
// @Success 200  {object} responses.UserResponse  "User profile data"
// @Failure 401  {object} utils.CustomError  "Unauthorized, invalid or missing token"
// @Failure 404  {object} utils.CustomError  "User not found"
// @Failure 500  {object} utils.CustomError  "Database error"
// @Security     ApiKeyAuth
// @Router       /me [get]
func GetMyProfile(c *gin.Context) {
	var user models.User
	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusInternalServerError, utils.New(errors.New("user not found"), http.StatusInternalServerError))
		return
	}

	result := db.DB.First(&user, userId)

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