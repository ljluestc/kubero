package main

import (
	"fmt"
	"github.com/kubero-dev/kubero/pkg/core"
)

func main() {
	fmt.Println("Starting Kubero...")
	app := core.NewApp()
	app.Run()
}
