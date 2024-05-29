package gateway

import "github.com/pedropereiraassis/full-cycle/microsservices/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	Get(id string) (*entity.Account, error)
	UpdateBalance(account *entity.Account) error
}