package product

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

// GetProduct godoc
// @Summary      Get product information
// @Description  Retrieve product info by id
// @Tags         products
// @Produce      json
// @Param        id   path      int  true  "Product ID"
// @Success 200 {object} responses.ProductResponse "Product data"
// @Failure 404 {object} utils.CustomError "product not found"
// @Failure 500 {object} utils.CustomError "database error"
// @Security     ApiKeyAuth
// @Router       /product/{id} [get]
func GetProduct(c *gin.Context) {
	idStr := c.Params.ByName("id") // assign product id to idStr
	id, _ := strconv.Atoi(idStr) // convert id param to int
	
	var product models.Product

	result := db.DB.First(&product, id)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		errResp := utils.New(errors.New("product not found"), http.StatusNotFound)
        c.JSON(http.StatusNotFound, errResp)
        return
    } else if result.Error != nil {
        errResp := utils.New(errors.New("database error"), http.StatusInternalServerError).WithDetails(result.Error.Error())
		c.JSON(http.StatusInternalServerError, errResp)
        return
    }

	response := responses.ProductResponse{
		ID: product.ID,
		Name: product.Name,
		Description: product.Description,
		Price: product.Price,
		Quantity: product.Quantity,
		Category: product.Category,
		ImageURL: product.ImageURL,
	}

    c.JSON(http.StatusOK, response)
}

// GetAllProducts godoc
// @Summary      Get all products
// @Description  Retrieve all products from the database
// @Tags         products
// @Produce      json
// @Success      200  {array}  responses.ProductResponse
// @Failure      500  {object}  map[string]string
// @Router       /products [get]
func GetAllProducts(c *gin.Context) {
    var products []models.Product

    result := db.DB.Find(&products)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // Map DB models to response DTOs
    var productResponses []responses.ProductResponse
    for _, p := range products {
        productResponse := responses.ProductResponse{
            ID: p.ID,
			Name: p.Name,
			Description: p.Description,
			Price: p.Price,
			Quantity: p.Quantity,
			Category: p.Category,
			ImageURL: p.ImageURL,
        }
        productResponses = append(productResponses, productResponse)
    }

    c.JSON(http.StatusOK, productResponses)
}

// AddProduct godoc
// @Summary      Add a new product
// @Description  Create a new product and store it in the database.
// @Tags         products
// @Accept       json
// @Produce      json
// @Param        product  body      models.Product      true  "Product JSON"
// @Success      201      {object}  responses.ProductResponse "Created product"
// @Failure      400      {object}  utils.CustomError   "Invalid request body"
// @Failure      500      {object}  utils.CustomError   "Database error"
// @Router       /addProduct [post]
func AddProduct(c *gin.Context) {
    var req models.Product

    if err := c.ShouldBindJSON(&req); err != nil {
        errResp := utils.New(err, http.StatusBadRequest).WithDetails("Invalid JSON body")
        c.JSON(http.StatusBadRequest, errResp)
        return
    }

    product := models.Product{
        Name: req.Name,
        Description: req.Description,
        Price: req.Price,
		Quantity: req.Quantity,
		Category: req.Category,
		ImageURL: req.ImageURL,
    }

    result := db.DB.Create(&product)
    if result.Error != nil {
        errResp := utils.New(result.Error, http.StatusInternalServerError)
        c.JSON(http.StatusInternalServerError, errResp)
        return
    }

    response := responses.ProductResponse{
        ID:          product.ID,
        Name:        product.Name,
        Description: product.Description,
        ImageURL:    product.ImageURL,
        Quantity:    product.Quantity,
        Price:       product.Price,
        Category:    product.Category,
    }

    c.JSON(http.StatusCreated, response)
}

