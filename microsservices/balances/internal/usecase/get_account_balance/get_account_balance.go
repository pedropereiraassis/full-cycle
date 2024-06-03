package get_account_balance

import (
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/gateway"
)

type GetAccountBalanceInputDTO struct {
	AccountID string `json:"accountId"`
}

type GetAccountBalanceOutputDTO struct {
	ID       string  `json:"id"`
	ClientID string  `json:"clientId"`
	Amount   float64 `json:"amount"`
}

type GetAccountBalanceUseCase struct {
	AccountGateway gateway.AccountGateway
}

func NewGetAccountBalanceUseCase(accountGateway gateway.AccountGateway) *GetAccountBalanceUseCase {
	return &GetAccountBalanceUseCase{
		AccountGateway: accountGateway,
	}
}

func (uc *GetAccountBalanceUseCase) Execute(input GetAccountBalanceInputDTO) (*GetAccountBalanceOutputDTO, error) {
	account, err := uc.AccountGateway.Get(input.AccountID)
	if err != nil {
		return nil, err
	}

	return &GetAccountBalanceOutputDTO{
		ID:       account.ID,
		ClientID: account.Client.ID,
		Amount:   account.Balance,
	}, nil
}
