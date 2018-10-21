package main

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"

	"github.com/alexdavid/sigma"
	"github.com/alexdavid/sigma-web/backend/helpers"
	"github.com/alexdavid/sigma/mock"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	client, err := mock.NewClient()
	if err != nil {
		panic(err)
	}

	helpers.HandleStatic(r, "/", "index.html")
	helpers.HandleStatic(r, "/main.js", "dist/main.js")

	helpers.HandleApi(r, "GET", "/api/chats", func(vars map[string]string, body io.ReadCloser) (interface{}, error) {
		return client.Chats()
	})

	helpers.HandleApi(r, "GET", "/api/chats/{chatId:[0-9]+}", func(vars map[string]string, body io.ReadCloser) (interface{}, error) {
		chatId, err := strconv.Atoi(vars["chatId"])
		if err != nil {
			return nil, err
		}
		return client.Messages(sigma.MessagesQuery{
			ChatId: chatId,
		})
	})

	type sendMessageJson struct {
		Message string `json:"message"`
	}
	helpers.HandleApi(r, "POST", "/api/chats/{chatId:[0-9]+}", func(vars map[string]string, body io.ReadCloser) (interface{}, error) {
		chatId, err := strconv.Atoi(vars["chatId"])
		if err != nil {
			return nil, err
		}
		var unmarshaled sendMessageJson
		decoder := json.NewDecoder(body)
		err = decoder.Decode(&unmarshaled)
		if err != nil {
			return nil, err
		}
		return struct{}{}, client.SendMessage(chatId, unmarshaled.Message)
	})

	err = http.ListenAndServe("127.0.0.1:8080", r)
	panic(err)
}
