FROM golang:1.22

WORKDIR /go/src

RUN apt-get update && apt-get install librdkafka-dev -y

CMD ["tail", "-f", "/dev/null"]