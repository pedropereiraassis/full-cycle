package createtransaction

import (
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/entity"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/gateway"
)

type CreateTransactionInputDTO struct {
	AccountIDFrom string
	AccountIDTo   string
	Amount        float64
}

type CreateTransactionOutputDTO struct {
	ID string
}

type CreateTransactionUseCase struct {
	TransactionGateway gateway.TransactionGateway
	AccountGateway     gateway.AccountGateway
}

func NewCreateTransactionUseCase(transactionGateway gateway.TransactionGateway, accountGateway gateway.AccountGateway) *CreateTransactionUseCase {
	return &CreateTransactionUseCase{
		TransactionGateway: transactionGateway,
		AccountGateway:     accountGateway,
	}
}

func (uc *CreateTransactionUseCase) Execute(input CreateTransactionInputDTO) (*CreateTransactionOutputDTO, error) {
	accountFrom, err := uc.AccountGateway.Get(input.AccountIDFrom)
	if err != nil {
		return nil, err
	}

	accountTo, err := uc.AccountGateway.Get(input.AccountIDTo)
	if err != nil {
		return nil, err
	}

	transaction, err := entity.NewTransaction(accountFrom, accountTo, input.Amount)
	if err != nil {
		return nil, err
	}

	err = uc.TransactionGateway.Save(transaction)
	if err != nil {
		return nil, err
	}

	return &CreateTransactionOutputDTO{
		ID: transaction.ID,
	}, nil
}