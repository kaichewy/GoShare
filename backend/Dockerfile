FROM golang:1.24.3-alpine

LABEL author="Kai"

# Set the working directory inside the container
WORKDIR /backend

RUN go install github.com/air-verse/air@latest
RUN go install github.com/swaggo/swag/cmd/swag@latest

COPY go.* ./
RUN go mod download

#Copy source code
COPY . .

RUN go build -o bin .

# Set an environment variable for the port
ENV PORT=8080

# Expose the container's internal port (for docs)
EXPOSE ${PORT}

# Generate Swagger documentation
RUN swag init -g api/api.go

CMD ["air"]

