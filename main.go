package main

import (
    "fmt"
    "os"

    "github.com/logan/portfolio/server"
)

func main() {
    if err := server.Main(); err != nil {
        fmt.Fprintf(os.Stderr, "error: %v\n", err)
        os.Exit(1)
    }
}
