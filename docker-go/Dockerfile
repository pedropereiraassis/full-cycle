FROM golang:1.21-alpine as builder

WORKDIR /go/src

COPY hello.go .

RUN go mod init hello

RUN go build -o /hello


FROM scratch

COPY --from=builder /hello /hello

ENTRYPOINT [ "/hello" ]