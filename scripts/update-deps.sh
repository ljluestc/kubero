#!/bin/bash

# Update Go module dependencies
go mod tidy
go mod verify

# Get the specific version needed for controller-runtime/fake
go get sigs.k8s.io/controller-runtime/pkg/client/fake@v0.17.2
go get github.com/evanphx/json-patch@v5.6.0+incompatible

# Final tidy to ensure everything is consistent
go mod tidy

echo "Dependencies updated successfully"
