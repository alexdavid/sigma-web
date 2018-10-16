package helpers

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/alexdavid/sigma-web/frontend"
	"github.com/gorilla/mux"
)

func HandleApi(router *mux.Router, method string, url string, handlerFn func(map[string]string, io.ReadCloser) (interface{}, error)) {
	router.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		data, err := handlerFn(mux.Vars(r), r.Body)
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
	}).Methods(method)
}

func HandleStatic(router *mux.Router, url string, staticFileName string) {
	router.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
		data, err := frontend.Asset(staticFileName)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
		w.Write(data)
	})
}
