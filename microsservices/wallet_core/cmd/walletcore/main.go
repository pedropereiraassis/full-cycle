package main

import (
	"context"
	"database/sql"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/database"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/event"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/event/handler"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/usecase/create_account"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/usecase/create_client"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/usecase/create_transaction"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/web"
	"github.com/pedropereiraassis/full-cycle/wallet_core/internal/web/webserver"
	"github.com/pedropereiraassis/full-cycle/wallet_core/pkg/events"
	"github.com/pedropereiraassis/full-cycle/wallet_core/pkg/kafka"
	"github.com/pedropereiraassis/full-cycle/wallet_core/pkg/uow"
)

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "wallet_core_db", "3306", "wallet_core"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	kafkaProducer := kafka.NewKafkaProducer(&configMap)

	eventDispatcher := events.NewEventDispatcher()
	eventDispatcher.Register("TransactionCreated", handler.NewTransactionCreatedKafkaHandler(kafkaProducer))
	eventDispatcher.Register("BalanceUpdated", handler.NewBalanceUpdatedKafkaHandler(kafkaProducer))
	transactionCreatedEvent := event.NewTransactionCreated()
	balanceUpdatedEvent := event.NewBalanceUpdated()

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
	createTransactionUseCase := create_transaction.NewCreateTransactionUseCase(uow, eventDispatcher, transactionCreatedEvent, balanceUpdatedEvent)
	createClientUseCase := create_client.NewCreateClientUseCase(clientDb)
	createAccountUseCase := create_account.NewCreateAccountUseCase(accountDb, clientDb)

	webserver := webserver.NewWebServer(":8080")

	clientHandler := web.NewWebClientHandler(*createClientUseCase)
	accountHandler := web.NewWebAccountHandler(*createAccountUseCase)
	transactionHandler := web.NewWebTransactionHandler(*createTransactionUseCase)

	webserver.Addhandler("/clients", clientHandler.CreateClient)
	webserver.Addhandler("/accounts", accountHandler.CreateAccount)
	webserver.Addhandler("/transactions", transactionHandler.CreateTransaction)

	fmt.Println("Server is running")
	webserver.Start()
}
