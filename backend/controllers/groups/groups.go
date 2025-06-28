package group

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/db"
	"github.com/kaichewy/GoShare/backend/models"
	"github.com/kaichewy/GoShare/backend/utils"
)

// GetGroup godoc
// @Summary      Get a group by ID
// @Description  Retrieve a specific group order by its ID
// @Tags         groups
// @Produce      json
// @Param        id   path      int  true  "Group ID"
// @Success      200 {object} models.Group "Group data"
// @Failure      400 {object} utils.CustomError "Invalid ID"
// @Failure      404 {object} utils.CustomError "Group not found"
// @Failure      500 {object} utils.CustomError "Database error"
// @Router       /groups/{id} [get]
func GetGroup(c *gin.Context) {
	idStr := c.Param("id") // Get :id from URL
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.New(err, http.StatusBadRequest).WithDetails("Invalid group ID"))
		return
	}

	var group models.Group
	if err := db.DB.Preload("Members").First(&group, id).Error; err != nil {
		c.JSON(http.StatusNotFound, utils.New(err, http.StatusNotFound).WithDetails("Group not found"))
		return
	}

	c.JSON(http.StatusOK, group)
}

type AddGroupRequest struct {
	Name      string    `json:"name" binding:"required"`
	ProductID uint      `json:"product_id" binding:"required"`
	MemberIDs []uint    `json:"member_ids"`
}

// AddGroup godoc
// @Summary      Create a new group
// @Description  Add a new group with an optional list of member user IDs.
// @Tags         groups
// @Accept       json
// @Produce      json
// @Param        group body AddGroupRequest true "Group data"
// @Success      201 {object} models.Group
// @Failure      400 {object} utils.CustomError
// @Failure      500 {object} utils.CustomError
// @Router       /groups [post]
func AddGroup(c *gin.Context) {
	var req AddGroupRequest // ✅ Bind to request struct

	// Bind JSON input
	if err := c.ShouldBindJSON(&req); err != nil {
		errResp := utils.New(err, http.StatusBadRequest).WithDetails("Invalid JSON body")
		c.JSON(http.StatusBadRequest, errResp)
		return
	}

	// Map to DB model
	group := models.Group{
		Name:      req.Name,
		ProductID: req.ProductID,
	}

	// Load members if any
	if len(req.MemberIDs) > 0 {
		var members []models.User
		if err := db.DB.Where("id IN ?", req.MemberIDs).Find(&members).Error; err != nil {
			errResp := utils.New(err, http.StatusInternalServerError).WithDetails("Failed to find members")
			c.JSON(http.StatusInternalServerError, errResp)
			return
		}
		group.Members = members
	}

	// Save to DB
	if err := db.DB.Create(&group).Error; err != nil {
		errResp := utils.New(err, http.StatusInternalServerError).WithDetails("Failed to create group")
		c.JSON(http.StatusInternalServerError, errResp)
		return
	}

	c.JSON(http.StatusCreated, group)
}
