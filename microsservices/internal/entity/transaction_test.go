package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	clientFrom, _ := NewClient("John Doe", "john@email.com")
	accountFrom := NewAccount(clientFrom)
	accountFrom.Credit(1000)

	clientTo, _ := NewClient("Jane Doe", "jane@email.com")
	accountTo := NewAccount(clientTo)
	accountTo.Credit(1000)

	transaction, err := NewTransaction(accountFrom, accountTo, 100)

	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, float64(900), accountFrom.Balance)
	assert.Equal(t, float64(1100), accountTo.Balance)
}

func TestCreateTransactionWithInsufficientBalance(t *testing.T) {
	clientFrom, _ := NewClient("John Doe", "john@email.com")
	accountFrom := NewAccount(clientFrom)
	accountFrom.Credit(1000)

	clientTo, _ := NewClient("Jane Doe", "jane@email.com")
	accountTo := NewAccount(clientTo)
	accountTo.Credit(1000)

	transaction, err := NewTransaction(accountFrom, accountTo, 2000)

	assert.NotNil(t, err)
	assert.Nil(t, transaction)
	assert.Error(t, err, "insufficient funds")
	assert.Equal(t, float64(1000), accountFrom.Balance)
	assert.Equal(t, float64(1000), accountTo.Balance)
}