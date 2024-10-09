FROM golang:1.22

WORKDIR /go

COPY server.go .

RUN go mod init server

RUN go build -o /server

CMD ["/server"]
