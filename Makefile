.PHONY: build test clean fmt lint vet

# Default target
all: build

# Build the application
build:
	go build -o bin/kubero ./...

# Run tests
test:
	go test ./... -v

# Clean build artifacts
clean:
	rm -rf bin/

# Format code
fmt:
	go fmt ./...

# Run linter
lint:
	golint ./...

# Run vet
vet:
	go vet ./...

# Install dependencies
deps:
	go mod tidy
	go mod vendor

# Run the application
run:
	go run ./...
