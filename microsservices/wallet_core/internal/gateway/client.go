package gateway

import "github.com/pedropereiraassis/full-cycle/wallet_core/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}