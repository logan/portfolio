package server

import (
    "fmt"
    "net/http"
    "os"
    "strings"

    "github.com/gorilla/handlers"
    "github.com/voxelbrain/goptions"
)

type ServerConfig struct {
    Port int `goptions:"-p, --port, obligatory, description='Serve on this port.'"`
    StaticPath string `goptions:"-S, --static-path, description='Serve static assets from this directory.'"`
}

type Server struct {
    *Sass
    ServerConfig
    StaticHandler http.Handler
}

func NewServer(config ServerConfig) *Server {
    fileServer := http.FileServer(http.Dir(config.StaticPath))
    return &Server{
        ServerConfig: config,
        Sass: SassFile(config.StaticPath + "/css/style.scss"),
        StaticHandler: http.StripPrefix("/static", fileServer),
    }
}

func (server *Server) ListenAndServe() error {
    log := os.Stdout
    handler := handlers.CombinedLoggingHandler(log, server)
    return http.ListenAndServe(fmt.Sprintf(":%d", server.ServerConfig.Port), handler)
}

func (server *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // Everything under static, except for /static/css/..., is fair game.
    // A request for /static/css/style.css will yield the sass compilation of
    // static/css/style.sass.

    if r.URL.Path == "/resume.html" {
        http.ServeFile(w, r, server.ServerConfig.StaticPath + "/templates/resume.html")
    } else if strings.HasPrefix(r.URL.Path, "/static/css") {
        if r.URL.Path == "/static/css/style.css" {
            server.Sass.ServeHTTP(w, r)
        } else {
            http.NotFound(w, r)
        }
    } else if strings.HasPrefix(r.URL.Path, "/static") {
        server.StaticHandler.ServeHTTP(w, r)
    } else {
        http.ServeFile(w, r, server.ServerConfig.StaticPath + "/templates/index.html")
    }
}

func Main() error {
    options := struct {
        ServerConfig
        goptions.Help
    }{
        ServerConfig: ServerConfig{
            Port: 8080,
            StaticPath: "static",
        },
    }

    if err := goptions.Parse(&options); err != nil {
        if err == goptions.ErrHelpRequest {
            goptions.PrintHelp()
        }
        return err
    }

    server := NewServer(options.ServerConfig)
    return server.ListenAndServe()
}
