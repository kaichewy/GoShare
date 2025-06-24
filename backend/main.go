package main

import (
	"os"

	"github.com/gin-gonic/gin"                // import gin framework
	"github.com/kaichewy/GoShare/backend/api" // import api route definitions to register all endpoints
	"github.com/kaichewy/GoShare/backend/db"
)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()
	api.RegisterRoutes(r)
	return r
}

func main() {
	db.Connect() // connect database

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":"+port)
}
