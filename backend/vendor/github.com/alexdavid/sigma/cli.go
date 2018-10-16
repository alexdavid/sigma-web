package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/alexdavid/sigma/sigma"
)

func main() {
	command := os.Args[1]
	if command == "send-message" {
		chatId, err := strconv.Atoi(os.Args[2])
		if err != nil {
			log.Fatal(err)
		}
		message := os.Args[3]

		err = sigma.SendMessage(chatId, message)
		if err != nil {
			log.Fatal(err)
		}
		return
	}

	if command == "get-messages" {
		chatId, err := strconv.Atoi(os.Args[2])
		if err != nil {
			log.Fatal(err)
		}

		messages, err := sigma.Messages(sigma.MessagesQuery{
			ChatId: chatId,
			Limit:  1,
		})
		if err != nil {
			log.Fatal(err)
		}

		json, err := json.Marshal(messages)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(string(json))
		return
	}

	if command == "get-attachments" {
		messageId, err := strconv.Atoi(os.Args[2])
		if err != nil {
			log.Fatal(err)
		}

		attachments, err := sigma.Attachments(messageId)
		if err != nil {
			log.Fatal(err)
		}

		json, err := json.Marshal(attachments)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(string(json))
		return
	}

	if command == "get-chats" {
		chats, err := sigma.Chats()
		if err != nil {
			log.Fatal(err)
		}

		json, err := json.Marshal(chats)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(string(json))
		return
	}

	log.Fatal("Unkonwn command")
}
