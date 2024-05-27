package createtransaction

import (
	"testing"

	"github.com/pedropereiraassis/full-cycle/microsservices/internal/entity"
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

type TransactionGatewayMock struct {
	mock.Mock
}

func (m *TransactionGatewayMock) Save(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	clientFrom, _ := entity.NewClient("Client From", "clientFrom@email.com")
	accountFrom := entity.NewAccount(clientFrom)
	accountFrom.Credit(1000)

	clientTo, _ := entity.NewClient("Client To", "clientTo@email.com")
	accountTo := entity.NewAccount(clientTo)
	accountTo.Credit(1000)

	mockAccountGateway := &AccountGatewayMock{}
	mockAccountGateway.On("Get", accountFrom.ID).Return(accountFrom, nil)
	mockAccountGateway.On("Get", accountTo.ID).Return(accountTo, nil)

	mockTransactionGateway := &TransactionGatewayMock{}
	mockTransactionGateway.On("Save", mock.Anything).Return(nil)

	uc := NewCreateTransactionUseCase(mockTransactionGateway, mockAccountGateway)

	inputDTO := CreateTransactionInputDTO{
		AccountIDFrom: accountFrom.ID,
		AccountIDTo:   accountTo.ID,
		Amount:        100,
	}

	output, err := uc.Execute(inputDTO)
	assert.Nil(t, err)
	assert.NotNil(t, output)
	assert.NotEmpty(t, output.ID)
	mockAccountGateway.AssertExpectations(t)
	mockTransactionGateway.AssertExpectations(t)
	mockAccountGateway.AssertNumberOfCalls(t, "Get", 2)
	mockTransactionGateway.AssertNumberOfCalls(t, "Save", 1)
}
