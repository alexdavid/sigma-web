package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"

	"github.com/alexdavid/sigma"
	"github.com/alexdavid/sigma-web/backend/helpers"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	client, err := sigma.NewClient()
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

	helpers.HandleApi(r, "GET", "/api/attachments/{messageId:[0-9]+}", func(vars map[string]string, body io.ReadCloser) (interface{}, error) {
		messageId, err := strconv.Atoi(vars["messageId"])
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
	})

	helpers.HandleFile(r, "/api/attachments/{messageId:[0-9]+}/{attachmentIdx:[0-9]+}{_:[.a-z]*}", func(vars map[string]string, body io.ReadCloser) (*os.File, error) {
		messageId, err := strconv.Atoi(vars["messageId"])
		if err != nil {
			return nil, err
		}
		attachmentIdx, err := strconv.Atoi(vars["attachmentIdx"])
		if err != nil {
			return nil, err
		}
		pathsOnDisk, err := client.Attachments(messageId)
		if err != nil {
			return nil, err
		}
		return os.Open(pathsOnDisk[attachmentIdx])
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
