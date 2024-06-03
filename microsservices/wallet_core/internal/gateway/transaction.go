package gateway

import "github.com/pedropereiraassis/full-cycle/wallet_core/internal/entity"

type TransactionGateway interface {
	Save(transaction *entity.Transaction) error
}