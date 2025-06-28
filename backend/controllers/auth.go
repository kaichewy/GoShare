package controllers

import (
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kaichewy/GoShare/backend/db"     // import database
	"github.com/kaichewy/GoShare/backend/models" // import User model
	"github.com/kaichewy/GoShare/backend/utils"
	"gorm.io/gorm"
)

// LoginRequest defines the request body for user login
type LoginRequest struct {
	Email    string `json:"email" example:"user@example.com" binding:"required,email"`
	Password string `json:"password" example:"password123" binding:"required,min=6"`
}

// Login godoc
// @Summary Log in a user
// @Description Authenticates a user with email and password, generates a JWT, sets it as an HTTP-only cookie, and returns a success response.
// @Tags auth
// @Accept json
// @Produce json
// @Param input body LoginRequest true "Login credentials"
// @Success 201 {object} map[string]string "User logged in successfully"
// @Failure 400 {object} utils.CustomError "Invalid request body or user does not exist"
// @Failure 401 {object} utils.CustomError "Invalid password"
// @Failure 500 {object} utils.CustomError "Internal server error"
// @Router /login [post]
func Login(c *gin.Context) {
	var input LoginRequest

	if err := c.ShouldBindBodyWithJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, utils.New(err, http.StatusBadRequest))
		return
	}

	// Check if user already exists
	var existing models.User
	err := db.DB.Where("email = ?", input.Email).First(&existing).Error
	if err == gorm.ErrRecordNotFound {
		c.JSON(http.StatusBadRequest, utils.New(
			errors.New("user does not exist"),
			http.StatusBadRequest,
		))
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, utils.New(
			errors.New("database error"),
			http.StatusInternalServerError,
		).WithDetails(err.Error()))
		return
	}
	
	// check if correct password was entered
	attempted_password := input.Password
	correct_password := existing.Password

	if (!utils.CheckPasswordHash(attempted_password, correct_password)) {
		c.JSON(http.StatusUnauthorized, utils.New(
			errors.New("invalid password"),
			http.StatusUnauthorized,
		))
		return
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": existing.ID,
		"expr": time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.New(errors.New("error generating token"), http.StatusInternalServerError,).WithDetails(err.Error()))
		return
	}

	// use jwt
	// type loginResponse struct {
	// 	Token string `json:"token"`
	// }
	// c.JSON(http.StatusOK, loginResponse{Token: tokenString})

	// use cookie
	c.SetCookie(
		"token",
		tokenString,
		3600,
		"/",
		os.Getenv("API_DOMAIN"),
		true,
		true,
	)

	// optional: return success message
	c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully"})
}


// RegisterRequest defines the request body for user registration
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// Register godoc
// @Summary Register a new user
// @Description Creates a new user account with name, email, and password. Password is hashed before storing.
// @Tags auth
// @Accept json
// @Produce json
// @Param input body RegisterRequest true "Registration data"
// @Success 201 {object} map[string]string "User registered successfully"
// @Failure 400 {object} utils.CustomError "Invalid registration data or user already exists"
// @Failure 500 {object} utils.CustomError "Database error or password hashing failed"
// @Router /register [post]
func Register(c *gin.Context) {
	var input RegisterRequest

	if err := c.ShouldBindBodyWithJSON(&input); err != nil {c.JSON(http.StatusBadRequest, utils.New(err, http.StatusBadRequest).WithDetails("Invalid registration data"))
		return
	}

	// Check if user already exists
	var existing models.User
	err := db.DB.Where("email = ?", input.Email).First(&existing).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusInternalServerError, utils.New(err, http.StatusInternalServerError).WithDetails("Database error while checking user existence"))
		return
	}
	if existing.ID != 0 {
		c.JSON(http.StatusBadRequest, utils.New(errors.New("user already exists"), http.StatusBadRequest).WithDetails("Email address is already registered"))
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(input.Password)
	if err != nil {c.JSON(http.StatusInternalServerError, utils.New(err, http.StatusInternalServerError).WithDetails("Could not hash password"))
		return
	}

	// Create User
	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
	}

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, 
			utils.New(err, http.StatusInternalServerError).
				WithDetails("Could not create user in database"))
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func AuthMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization"})
			c.Abort()
			return
		}
		// validate "bearer <token>" format (authorization header always has to be Bearer <token>;  eg. Bearer w7168eda8s)
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization format"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// Step 3: Parse and validate JWT
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			_, ok := t.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, jwt.ErrTokenSignatureInvalid
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Step 4: Store token claims in context
		claims, ok := token.Claims.(jwt.MapClaims)
		if ok {
			c.Set("userId", claims["userId"])
		}

		// continue to the next handler
		c.Next()
	}
}