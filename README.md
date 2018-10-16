# sigma-web

A web-based frontend for [Sigma](https://github.com/alexdavid/sigma)

## Installation
Sigma-Web requires an Apple comupter running MacOS 10.12 or later to act as your iMessage server.

To get started install sigma-web must be installed on your MacOS machine:
```shell
go get github.com/alexdavid/sigma-web/backend
```
Then see [Usage](#Usage) below to tunnel into your mac from another machine

## Usage
**Sigma-web provides no authentication! Anyone who has access to the web server can read and send messages on your behalf.**
To help secure this it listens on `127.0.0.1` only. Change this at your own risk. The preferred way of accessing sigma-web is over an ssh tunnel. For more details see [authentication](#Authentication) below.

To run sigma and tunnel messages over ssh from a remote machine run something like the following:
```shell
$ ssh -L 8080:localhost:8080 [user]@[host] backend
```
Then you should be able to connect to it by hitting [localhost:8080](http://localhost:8080) in your browser.


## Authentication
The main goal of sigma and its frontends are to do one single thing and do it well. In the case of this project that means expose the Sigma Golang API over a easy to use web interface. That is all. I have no interest in rolling my own authentication layer and keeping it hardened.

To keep it secure I recommend using VPN or SSH tunnel which are proven and more secure than a custom authentication layer and will give you end-to-end encryption out of the box.


## Alternatives
* [bboyairwreck/PieMessage](https://github.com/bboyairwreck/PieMessage)

## TODO
  - [ ] Add screenshots
  - [ ] Add tests
