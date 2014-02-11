package server

import "errors"
import "fmt"
import "net/http"
import "os"
import "sync"
import "time"

import "github.com/moovweb/gosass"

type Sass struct {
	Path            string
	lock            sync.Mutex
	lastCompileTime time.Time
    lastModified string
	lastOutput      string
}

func SassFile(path string) *Sass {
	return &Sass{Path: path}
}

func (s *Sass) Get() (string, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	f, err := os.Open(s.Path)
	if err != nil {
		return "", err
	}
	fi, err := f.Stat()
	if err != nil {
		return "", err
	}
	if fi.ModTime().After(s.lastCompileTime) {
		if err := s.compile(fi); err != nil {
			return "", err
		}
	}
	return s.lastOutput, nil
}

func (s *Sass) compile(fi os.FileInfo) error {
	c := gosass.FileContext{
		InputPath: s.Path,
	}
	gosass.CompileFile(&c)
	if c.ErrorStatus != 0 {
		return errors.New(c.ErrorMessage)
	}
	s.lastOutput = c.OutputString
	s.lastCompileTime = fi.ModTime()
    s.lastModified = s.lastCompileTime.UTC().Format(http.TimeFormat)
	return nil
}

func serveErr(w http.ResponseWriter, err error) {
	code := http.StatusInternalServerError
	msg := err.Error()
	if os.IsNotExist(err) {
		code = http.StatusNotFound
		msg = "file not found"
	}
	w.WriteHeader(code)
	w.Write([]byte(msg))
}

func (s *Sass) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	content, err := s.Get()
	if err != nil {
		serveErr(w, err)
		return
	}
    if r.Header.Get("If-Modified-Since") == s.lastModified {
		h := w.Header()
		delete(h, "Content-Type")
		delete(h, "Content-Length")
		w.WriteHeader(http.StatusNotModified)
		return
	}
	bytes := []byte(content)
	w.Header().Set("Last-Modified", s.lastCompileTime.UTC().Format(http.TimeFormat))
	w.Header().Set("Content-Type", "text/css")
	w.Header().Set("Content-Length", fmt.Sprintf("%d", len(bytes)))
	w.Write(bytes)
}
