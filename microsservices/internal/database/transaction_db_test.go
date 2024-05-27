package database

import (
	"database/sql"
	"testing"

	"github.com/pedropereiraassis/full-cycle/microsservices/internal/entity"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db            *sql.DB
	clientFrom    *entity.Client
	clientTo      *entity.Client
	accountFrom   *entity.Account
	accountTo     *entity.Account
	transactionDB *TransactionDB
}

func (s *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db

	db.Exec("CREATE TABLE clients (id VARCHAR(255), name VARCHAR(255), email VARCHAR(255), created_at date)")
	db.Exec("CREATE TABLE accounts (id VARCHAR(255), client_id VARCHAR(255), balance int, created_at date)")
	db.Exec("CREATE TABLE transactions (id VARCHAR(255), account_id_from VARCHAR(255), account_id_to VARCHAR(255), amount int, created_at date)")

	// creating clients
	s.clientFrom, err = entity.NewClient("Client From", "clientFrom@email.com")
	s.Nil(err)
	s.clientTo, err = entity.NewClient("Client To", "clientTo@email.com")
	s.Nil(err)

	// creating accounts
	s.accountFrom = entity.NewAccount(s.clientFrom)
	s.accountFrom.Balance = 1000
	s.Nil(err)
	s.accountTo = entity.NewAccount(s.clientTo)
	s.accountTo.Balance = 1000
	s.Nil(err)

	s.transactionDB = NewTransactionDB(db)
}

func (s *TransactionDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
	s.db.Exec("DROP TABLE accounts")
	s.db.Exec("DROP TABLE transactions")
}

func TestTransactionDBTestSuite(t *testing.T) {
	suite.Run(t, new(TransactionDBTestSuite))
}

func (s *TransactionDBTestSuite) TestSave() {
	transaction, err := entity.NewTransaction(s.accountFrom, s.accountTo, 100)
	s.Nil(err)

	err = s.transactionDB.Save(transaction)
	s.Nil(err)
}
