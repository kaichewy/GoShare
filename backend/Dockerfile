FROM golang:1.24.3-alpine

LABEL author="Kai"

# Set the working directory inside the container
WORKDIR /backend

RUN go install github.com/air-verse/air@latest

COPY go.* ./
RUN go mod download

COPY . .

RUN go build -o bin .

# Set an environment variable for the port
ENV PORT=8080

# Expose the container's internal port (for docs)
EXPOSE ${PORT}

CMD ["air"]

