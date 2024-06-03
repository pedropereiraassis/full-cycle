package update_account_balance

import (
	"fmt"

	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/gateway"
)

type UpdateAccountBalanceInputDTO struct {
	AccountID string  `json:"accountId"`
	Balance   float64 `json:"balance"`
}

type UpdateAccountBalanceOutputDTO struct {
	ID       string  `json:"accountId"`
	ClientID string  `json:"clientId"`
	Balance  float64 `json:"balance"`
}

type UpdateAccountBalanceUseCase struct {
	AccountGateway gateway.AccountGateway
}

func NewUpdateAccountBalanceUseCase(
	accountGateway gateway.AccountGateway,
) *UpdateAccountBalanceUseCase {
	return &UpdateAccountBalanceUseCase{
		AccountGateway: accountGateway,
	}
}

func (uc *UpdateAccountBalanceUseCase) Execute(input UpdateAccountBalanceInputDTO) (*UpdateAccountBalanceOutputDTO, error) {
	account, err := uc.AccountGateway.Get(input.AccountID)
	if err != nil {
		fmt.Println("Error getting account: ", err)
		return nil, err
	}

	account.Balance = input.Balance
	err = uc.AccountGateway.UpdateBalance(account)
	if err != nil {
		fmt.Println("Error updating account balance: ", err)
		return nil, err
	}

	return &UpdateAccountBalanceOutputDTO{
		ID:       account.ID,
		ClientID: account.Client.ID,
		Balance:  account.Balance,
	}, nil
}
