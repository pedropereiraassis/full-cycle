package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
	deliveryChan := make(chan kafka.Event)
	producer := NewKafkaProducer()
	defer producer.Close()
	Publish("Transaction made", "test", producer, []byte("transaction"), deliveryChan)
	go DeliveryReport(deliveryChan) // async

	producer.Flush(2000)
}

func NewKafkaProducer() *kafka.Producer {
	configMap := &kafka.ConfigMap{
		"bootstrap.servers": "go-kafka-1:9092",
		"delivery.timeout.ms": "0", // 0 means infinite timeout
		"acks": "all", // 0: no ack (high performance), 1: leader ack (medium performance), all: leader and replicas ack (low performance)
		"enable.idempotence": "true", // guarantees that messages are not duplicated - must be used with acks=all
	}

	producer, err := kafka.NewProducer(configMap)
	if err != nil {
		log.Println(err.Error())
	}

	return producer
}

func Publish(msg string, topic string, producer *kafka.Producer, key []byte, deliveryChan chan kafka.Event) error {
	kafkaMessage := &kafka.Message{
		Value:          []byte(msg),
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Key:            key,
	}

	err := producer.Produce(kafkaMessage, deliveryChan)
	if err != nil {
		return err
	}

	return nil
}

func DeliveryReport(deliveryChan chan kafka.Event) {
	for e := range deliveryChan {
		switch ev := e.(type) {
		case *kafka.Message:
			if ev.TopicPartition.Error != nil {
				fmt.Println("Error sending message")
			} else {
				fmt.Println("Message sent to topic", ev.TopicPartition)
				// save on database that message was processed
				// ex: confirm that a bank transaction was made
			}
		}
	}
}
