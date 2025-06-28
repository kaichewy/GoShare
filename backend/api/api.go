// @title GoShare API
// @version 1.0
// @description API documentation
// @host localhost:8080
// @BasePath /
package api

import (
	"github.com/gin-gonic/gin"
	"github.com/kaichewy/GoShare/backend/controllers" // import functions to be executed for the api calls
	group "github.com/kaichewy/GoShare/backend/controllers/groups"
	product "github.com/kaichewy/GoShare/backend/controllers/products"
	"github.com/swaggo/files"       // swagger embed files
	"github.com/swaggo/gin-swagger" // gin-swagger middleware
)


func RegisterRoutes(r *gin.Engine) {
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
	r.POST("/addProduct", product.AddProduct)

	// Group
	authorized.POST("/addGroup", group.AddGroup)
	authorized.GET("/group/:id", group.GetGroup)

}