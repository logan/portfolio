package server

import (
    "net/http"
    "net/http/httptest"
    "testing"

    . "github.com/smartystreets/goconvey/convey"
)

func TestServer(t *testing.T) {
    server := NewServer(ServerConfig{StaticPath: "../static"})

    Convey("/static/css/style.css", t, func() {
        req, err := http.NewRequest("GET", "http://localhost/static/css/style.css", nil)
        So(err, ShouldBeNil)
        rec := httptest.NewRecorder()
        server.ServeHTTP(rec, req)
        So(rec.Code, ShouldEqual, 200)
        So(rec.Body.String(), ShouldContainSubstring, "a:hover")

        req, err = http.NewRequest("GET", "http://localhost/static/css/style.css", nil)
        So(err, ShouldBeNil)
        req.Header.Add("If-Modified-Since", rec.HeaderMap["Last-Modified"][0])
        rec = httptest.NewRecorder()
        server.ServeHTTP(rec, req)
        So(rec.Code, ShouldEqual, 304)
    })

    Convey("Static files should be served", t, func() {
        req, err := http.NewRequest("GET", "http://localhost/static/js/app.js", nil)
        So(err, ShouldBeNil)
        rec := httptest.NewRecorder()
        server.ServeHTTP(rec, req)
        So(rec.Code, ShouldEqual, 200)
        So(rec.Body.String(), ShouldContainSubstring, "ngRoute")
    })

    Convey("404s should serve under /static/css", t, func() {
        req, err := http.NewRequest("GET", "http://localhost/static/css/blahblahblah", nil)
        So(err, ShouldBeNil)
        rec := httptest.NewRecorder()
        server.ServeHTTP(rec, req)
        So(rec.Code, ShouldEqual, 404)
    })

    Convey("404s outside of /static/css should serve static/templates/index.html", t, func() {
        req, err := http.NewRequest("GET", "http://localhost/blahblahblah", nil)
        So(err, ShouldBeNil)
        rec := httptest.NewRecorder()
        server.ServeHTTP(rec, req)
        So(rec.Code, ShouldEqual, 200)
        So(rec.Body.String(), ShouldContainSubstring, "<html")
    })
}
