package gateway

import "github.com/pedropereiraassis/full-cycle/microsservices/internal/entity"

type TransactionGateway interface {
	Save(transaction *entity.Transaction) error
}