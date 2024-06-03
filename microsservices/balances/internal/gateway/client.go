package gateway

import "github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}