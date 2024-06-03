package update_account_balance

import (
	"testing"

	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type AccountGatewayMock struct {
	mock.Mock
}

func (m *AccountGatewayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGatewayMock) Get(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func (m *AccountGatewayMock) UpdateBalance(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func TestUpdateAccountBalanceUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("John Doe")
	account := entity.NewAccount(client)

	accountGatewayMock := &AccountGatewayMock{}
	accountGatewayMock.On("Get", mock.Anything).Return(account, nil)
	accountGatewayMock.On("UpdateBalance", mock.Anything).Return(nil)

	uc := NewUpdateAccountBalanceUseCase(accountGatewayMock)

	inputDTO := UpdateAccountBalanceInputDTO{
		AccountID: account.ID,
		Balance:   100,
	}

	output, err := uc.Execute(inputDTO)

	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.NotEmpty(t, output.ID)
	assert.Equal(t, account.ID, output.ID)
	assert.Equal(t, inputDTO.Balance, output.Balance)
	accountGatewayMock.AssertExpectations(t)
	accountGatewayMock.AssertNumberOfCalls(t, "Get", 1)
	accountGatewayMock.AssertNumberOfCalls(t, "UpdateBalance", 1)
}
