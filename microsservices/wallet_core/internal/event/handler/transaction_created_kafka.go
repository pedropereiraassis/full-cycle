package handler

import (
	"fmt"
	"sync"

	"github.com/pedropereiraassis/full-cycle/wallet_core/pkg/events"
	"github.com/pedropereiraassis/full-cycle/wallet_core/pkg/kafka"
)

type TransactionCreatedKafkaHandler struct {
	Kafka *kafka.Producer
}

func NewTransactionCreatedKafkaHandler(kafka *kafka.Producer) *TransactionCreatedKafkaHandler {
	return &TransactionCreatedKafkaHandler{
		Kafka: kafka,
	}
}

func (h *TransactionCreatedKafkaHandler) Handle(message events.EventInterface, wg *sync.WaitGroup) {
	defer wg.Done()
	h.Kafka.Publish(message, nil, "transactions")
	fmt.Println("TransactionCreatedKafkaHandler called")
}
