// @title GoShare API
// @version 1.0
// @description API documentation
// @host localhost:8080
// @BasePath /
package api

import (
    "net/http"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "github.com/kaichewy/GoShare/backend/controllers" // import functions to be executed for the api calls
    group "github.com/kaichewy/GoShare/backend/controllers/groups"
    product "github.com/kaichewy/GoShare/backend/controllers/products"
    "github.com/swaggo/files" // swagger embed files
    "github.com/swaggo/gin-swagger" // gin-swagger middleware
)

func RegisterRoutes(r *gin.Engine) {
    r.Use(cors.New(cors.Config{
        AllowOrigins: []string{"http://localhost:5173"},
        AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders: []string{"Content-Length"},
        AllowCredentials: true, // Only true if you use cookies/session
    }))

    // Add root route - THIS IS WHAT'S MISSING
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "GoShare API is running!",
            "version": "1.0",
            "endpoints": gin.H{
                "swagger": "/swagger/index.html",
                "ping": "/ping",
                "products": "/products",
            },
        })
    })

    // Swagger
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // Ping
    r.GET("/ping", controllers.Ping)

    // User Info
    r.GET("/user/:id", controllers.GetUserInfo)

    // Auth
    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)

    // After logged in
    authorized := r.Group("/", controllers.AuthMiddleWare())
    authorized.GET("/me", controllers.GetMyProfile)
    // authorized.POST("buy", controllers.Buy)

    // Products
    r.GET("/products/:id", product.GetProduct)
    r.GET("/products", product.GetAllProducts)
    r.GET("/productsLimited", product.GetProductsLimited)
    r.POST("/addProduct", product.AddProduct)

    // Group
    authorized.POST("/addGroup", group.AddGroup)
    authorized.GET("/group/:id", group.GetGroup)
}