package responses

type ProductResponse struct {
    ID          uint     `json:"id"`
    Name        string   `json:"name"`
    Description string   `json:"description"`
    ImageURL    string   `json:"image"`
	Quantity	int		 `json:"quantity"`		
    Price       float64  `json:"price"`
    Category    string   `json:"category"`
}