package backend

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/alexdavid/sigma"
	"github.com/alexdavid/sigma-web/backend/helpers"
	"github.com/gorilla/mux"
)

func Start() error {
	r := mux.NewRouter()
	client, err := sigma.NewClient()
	if err != nil {
		return err
	}

	route(r, "GET", "/", helpers.StaticHandler("index.html"))
	route(r, "GET", "/main.js", helpers.StaticHandler("dist/main.js"))

	route(r, "GET", "/api/chats", helpers.JSONHandler(func(r *http.Request) (interface{}, error) {
		return client.Chats()
	}))

	route(r, "GET", "/api/chats/{chatId:[0-9]+}", helpers.JSONHandler(func(r *http.Request) (interface{}, error) {
		chatID, err := strconv.Atoi(mux.Vars(r)["chatId"])
		if err != nil {
			return nil, err
		}
		return client.Messages(chatID, sigma.MessageFilter{Limit: 50})
	}))

	route(r, "GET", "/api/attachments/{messageId:[0-9]+}", helpers.JSONHandler(func(r *http.Request) (interface{}, error) {
		messageId, err := strconv.Atoi(mux.Vars(r)["messageId"])
		if err != nil {
			return nil, err
		}
		pathsOnDisk, err := client.Attachments(messageId)
		if err != nil {
			return nil, err
		}
		urlPaths := []string{}
		for i, pathOnDisk := range pathsOnDisk {
			ext := path.Ext(pathOnDisk)
			urlPaths = append(urlPaths, fmt.Sprintf("/api/attachments/%d/%d%s", messageId, i, ext))
		}
		return urlPaths, nil
	}))

	route(r, "GET", "/api/attachments/{messageId:[0-9]+}/{attachmentIdx:[0-9]+}{_:(?:\\..+)?}", helpers.FileHandler(func(r *http.Request) (*os.File, error) {
		messageId, err := strconv.Atoi(mux.Vars(r)["messageId"])
		if err != nil {
			return nil, err
		}
		attachmentIdx, err := strconv.Atoi(mux.Vars(r)["attachmentIdx"])
		if err != nil {
			return nil, err
		}
		pathsOnDisk, err := client.Attachments(messageId)
		if err != nil {
			return nil, err
		}
		return os.Open(pathsOnDisk[attachmentIdx])
	}))

	type sendMessageJson struct {
		Message string `json:"message"`
	}
	route(r, "POST", "/api/chats/{chatId:[0-9]+}", helpers.JSONHandler(func(r *http.Request) (interface{}, error) {
		chatID, err := strconv.Atoi(mux.Vars(r)["chatId"])
		if err != nil {
			return nil, err
		}
		var unmarshaled sendMessageJson
		decoder := json.NewDecoder(r.Body)
		err = decoder.Decode(&unmarshaled)
		if err != nil {
			return nil, err
		}
		return struct{}{}, client.SendMessage(chatID, unmarshaled.Message)
	}))

	return http.ListenAndServe("127.0.0.1:8080", r)
}

func route(router *mux.Router, method string, url string, handler http.HandlerFunc) {
	router.HandleFunc(url, handler).Methods(method)
}
