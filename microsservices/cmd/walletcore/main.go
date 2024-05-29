package main

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/database"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/event"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/usecase/create_account"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/usecase/create_client"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/usecase/create_transaction"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/web"
	"github.com/pedropereiraassis/full-cycle/microsservices/internal/web/webserver"
	"github.com/pedropereiraassis/full-cycle/microsservices/pkg/events"
	"github.com/pedropereiraassis/full-cycle/microsservices/pkg/uow"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "localhost", "3307", "wallet"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	eventDispatcher := events.NewEventDispatcher()
	transactionCreatedEvent := event.NewTransactionCreated()
	// eventDispatcher.Register("TransactionCreated", handler)

	clientDb := database.NewClientDB(db)
	accountDb := database.NewAccountDB(db)

	ctx := context.Background()
	uow := uow.NewUow(ctx, db)

	uow.Register("AccountDB", func(tx *sql.Tx) interface{} {
		return database.NewAccountDB(db)
	})

	uow.Register("TransactionDB", func(tx *sql.Tx) interface{} {
		return database.NewTransactionDB(db)
	})

	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent)

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webServer := webserver.NewWebServer(":3000")
	webServer.Addhandler("/clients", clientHandler.CreateClient)
	webServer.Addhandler("/accounts", accountHandler.CreateAccount)
	webServer.Addhandler("/transactions", transactionHandler.CreateTransaction)

	webServer.Start()
}
