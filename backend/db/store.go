package db

import (
	"github.com/kaichewy/GoShare/backend/models" 
)

var Users = map[int]models.User{
	1: {ID: 1, Name: "Kai", Email: "kai.cyk10@gmail.com", Password: "123"},
	2: {ID: 2, Name: "Aaron", Email: "aaron@example.com", Password: "123"},
}

var UsersByEmail = map[string]models.User{
	"kai.cyk10@gmail.com": {ID: 1, Name: "Kai", Email: "kai.cyk10@gmail.com", Password: "123"},
	"aaron@example.com": {ID: 2, Name: "Aaron", Email: "aaron@example.com", Password: "123"},
}

