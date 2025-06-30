package group

import (
    "net/http"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/kaichewy/GoShare/backend/db"
    "github.com/kaichewy/GoShare/backend/models"
)

// AddGroupRequest represents the request body for creating a group
type AddGroupRequest struct {
    ProductID      uint   `json:"product_id" binding:"required"`
    BusinessName   string `json:"business_name" binding:"required"`
    TargetQuantity int    `json:"target_quantity" binding:"required,min=1"`
    Location       string `json:"location"`
    DeliveryDate   string `json:"delivery_date"`
    Description    string `json:"description"`
}

// JoinGroupRequest represents the request body for joining a group
type JoinGroupRequest struct {
    Quantity int `json:"quantity" binding:"min=1"` // How many items user wants to order
}

// AddGroup creates a new group
// @Summary Create a new group
// @Description Create a new collaborative buying group
// @Tags groups
// @Accept json
// @Produce json
// @Param request body AddGroupRequest true "Create group request"
// @Success 201 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 401 {object} gin.H
// @Failure 500 {object} gin.H
// @Security Bearer
// @Router /addGroup [post]
func AddGroup(c *gin.Context) {
    userID := c.GetString("userId") // From auth middleware
    
    // For testing without auth, use a default user ID
    var userIDUint uint = 1 // Default to user ID 1 for testing
    
    if userID != "" {
        // If userID exists from auth middleware, use it
        var err error
        userIDUint64, err := strconv.ParseUint(userID, 10, 32)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{
                "error": "Invalid user ID",
            })
            return
        }
        userIDUint = uint(userIDUint64)
    }

    var req AddGroupRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid request data",
            "details": err.Error(),
        })
        return
    }

    // Create new group using userIDUint (either from auth or default)
    newGroup := models.Group{
		Name: req.BusinessName + " Group",
        ProductID:       req.ProductID,
        BusinessName:    req.BusinessName,
        CurrentQuantity: 0,
        TargetQuantity:  req.TargetQuantity,
        Location:        req.Location,
        DeliveryDate:    req.DeliveryDate,
        Description:     req.Description,
        CreatedBy:       userIDUint, // ← Use the userIDUint
        CreatedAt:       time.Now(),
        UpdatedAt:       time.Now(),
    }

    result := db.DB.Create(&newGroup)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to create group",
            "details": result.Error.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "Group created successfully",
        "group": newGroup,
    })
}

// GetGroup gets a specific group by ID
// @Summary Get group by ID
// @Description Retrieve a specific group by its ID
// @Tags groups
// @Accept json
// @Produce json
// @Param id path string true "Group ID"
// @Success 200 {object} models.Group
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /group/{id} [get]
func GetGroup(c *gin.Context) {
    groupIdStr := c.Param("id")
    
    groupId, err := strconv.ParseUint(groupIdStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid group ID",
        })
        return
    }

    var group models.Group
    result := db.DB.Where("id = ?", groupId).First(&group)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Group not found",
        })
        return
    }

    c.JSON(http.StatusOK, group)
}

// GetGroupsByProduct gets all groups for a specific product
// @Summary Get groups by product ID
// @Description Retrieve all active groups for a specific product
// @Tags groups
// @Accept json
// @Produce json
// @Param productId path string true "Product ID"
// @Success 200 {array} models.Group
// @Failure 400 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /groups/product/{productId} [get]
func GetGroupsByProduct(c *gin.Context) {
    productIdStr := c.Param("productId")
    
    // Validate productId
    productId, err := strconv.ParseUint(productIdStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid product ID",
        })
        return
    }

    var groups []models.Group
    
    // Find all groups for this product, ordered by created_at
    result := db.DB.Where("product_id = ?", productId).
        Order("created_at DESC").
        Find(&groups)
    
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to fetch groups",
            "details": result.Error.Error(),
        })
        return
    }

    // If no groups found, return empty array instead of null
    if groups == nil {
        groups = []models.Group{}
    }

    c.JSON(http.StatusOK, groups)
}

// JoinGroup allows a user to join an existing group
// @Summary Join a group
// @Description Allow an authenticated user to join an existing group
// @Tags groups
// @Accept json
// @Produce json
// @Param id path string true "Group ID"
// @Param request body JoinGroupRequest true "Join group request"
// @Success 200 {object} gin.H
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Failure 409 {object} gin.H
// @Failure 500 {object} gin.H
// @Security Bearer
// @Router /groups/{id}/join [post]
func JoinGroup(c *gin.Context) {
    groupIdStr := c.Param("id")
    
    // Validate groupId
    groupId, err := strconv.ParseUint(groupIdStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid group ID",
        })
        return
    }

    // For testing: Use default user ID 1 (remove auth check)
    userIDUint := uint(1)

    // Parse request body
    var req JoinGroupRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        req.Quantity = 1 // Default quantity
    }

    // Start database transaction
    tx := db.DB.Begin()
    if tx.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to start transaction",
        })
        return
    }
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback()
        }
    }()

    // 1. Check if group exists
    var group models.Group
    result := tx.Where("id = ?", groupId).First(&group)
    if result.Error != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Group not found",
        })
        return
    }

    // 2. Check if user is already in the group
    var existingMember models.GroupMember
    result = tx.Where("group_id = ? AND user_id = ?", groupId, userIDUint).First(&existingMember)
    if result.Error == nil {
        tx.Rollback()
        c.JSON(http.StatusConflict, gin.H{
            "error": "User already joined this group",
            "group_id": groupId,
        })
        return
    }

    // 3. Check if group has reached target quantity
    if group.CurrentQuantity >= group.TargetQuantity {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Group has already reached target quantity",
            "current": group.CurrentQuantity,
            "target": group.TargetQuantity,
        })
        return
    }

    // 4. Add user to group
    newMember := models.GroupMember{
        GroupID:  uint(groupId),
        UserID:   userIDUint,
        Quantity: req.Quantity,
        JoinedAt: time.Now(),
    }

    result = tx.Create(&newMember)
    if result.Error != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to join group",
            "details": result.Error.Error(),
        })
        return
    }

    // 5. Update group's current quantity
    newTotal := group.CurrentQuantity + req.Quantity
    result = tx.Model(&group).Update("current_quantity", newTotal)
    if result.Error != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to update group quantity",
            "details": result.Error.Error(),
        })
        return
    }

    // Commit transaction
    if err := tx.Commit().Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to commit transaction",
            "details": err.Error(),
        })
        return
    }

    // Return success response
    c.JSON(http.StatusOK, gin.H{
        "message": "Successfully joined group",
        "group_id": groupId,
        "user_id": userIDUint,
        "quantity": req.Quantity,
        "new_total": newTotal,
        "target": group.TargetQuantity,
    })
}

// GetGroupMembers gets all members of a specific group (bonus function)
// @Summary Get group members
// @Description Get all members of a specific group with their details
// @Tags groups
// @Accept json
// @Produce json
// @Param id path string true "Group ID"
// @Success 200 {array} gin.H
// @Failure 400 {object} gin.H
// @Failure 404 {object} gin.H
// @Failure 500 {object} gin.H
// @Router /groups/{id}/members [get]
func GetGroupMembers(c *gin.Context) {
    groupIdStr := c.Param("id")
    
    groupId, err := strconv.ParseUint(groupIdStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid group ID",
        })
        return
    }

    // Check if group exists
    var group models.Group
    result := db.DB.Where("id = ?", groupId).First(&group)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "error": "Group not found",
        })
        return
    }

    // Get group members with user details
    var members []struct {
        models.GroupMember
        UserName  string `json:"user_name"`
        UserEmail string `json:"user_email"`
    }

    result = db.DB.Table("group_members").
        Select("group_members.*, users.name as user_name, users.email as user_email").
        Joins("JOIN users ON group_members.user_id = users.id").
        Where("group_members.group_id = ?", groupId).
        Order("group_members.joined_at ASC").
        Find(&members)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Failed to fetch group members",
            "details": result.Error.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "group": group,
        "members": members,
        "total_members": len(members),
    })
}