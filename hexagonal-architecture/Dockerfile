FROM golang:1.21

WORKDIR /go/src
ENV PATH="/go/bin:${PATH}"

RUN go install github.com/golang/mock/mockgen@v1.5.0 && \
    go install github.com/spf13/cobra-cli@latest

RUN apt-get update && apt-get install sqlite3 -y && apt-get clean

RUN go mod init github.com/pedropereiraassis/full-cycle/hexagonal-architecture
RUN go mod tidy

CMD ["tail", "-f", "/dev/null"]
