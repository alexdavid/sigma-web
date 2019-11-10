package helpers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/alexdavid/sigma-web/frontend"
)

func JSONHandler(handler func(r *http.Request) (interface{}, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := handler(r)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			data = struct {
				Error string `json:"error"`
			}{Error: err.Error()}
		}
		json, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		w.Write(json)
	}
}

func FileHandler(handler func(r *http.Request) (*os.File, error)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		file, err := handler(r)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		defer file.Close()
		io.Copy(w, file)
	}
}

func StaticHandler(fileName string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := frontend.Asset(fileName)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
		w.Write(data)
	}
}
