package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/alexdavid/sigma"
	"github.com/alexdavid/sigma-web/backend"
	"github.com/alexdavid/sigma/mock"
)

func main() {
	args := parseArgs()

	var client sigma.Client
	var err error
	if args.mock {
		client, err = mock.NewClient()
	} else {
		client, err = sigma.NewClient()
	}
	if err != nil {
		log.Fatal(err)
	}

	handler := backend.Build(client)
	log.Printf("Sigma web listening on %s", args.address)
	log.Fatal(http.ListenAndServe(args.address, handler))
}

type ParsedArgs struct {
	mock    bool
	address string
}

const hostFlagWarning = `
Setting this to 0.0.0.0 will allow anyone on your network send/read
your messages if you don't have a proper firewall set up!`

func parseArgs() ParsedArgs {
	mock := flag.Bool("mock", false, "Use mock sigma instead of reading from Messages app. Useful for development on non-macos systems")
	host := flag.String("host", "127.0.0.1", "Set a host address to listen on. Change this at your own risk."+hostFlagWarning)
	port := flag.Int("port", 8080, "Set a port to listen on")

	flag.Parse()

	if *mock {
		log.Println("Using mock backend")
	}

	if *host == "0.0.0.0" {
		log.Println("WARNING: HOST HAS BEEN SET TO 0.0.0.0. " + hostFlagWarning)
	}

	return ParsedArgs{
		mock:    *mock,
		address: fmt.Sprintf("%s:%d", *host, *port),
	}
}
