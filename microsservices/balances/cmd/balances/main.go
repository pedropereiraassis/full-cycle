package main

import (
	"database/sql"
	"encoding/json"
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/database"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/usecase/get_account_balance"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/usecase/update_account_balance"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/web"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/internal/web/webserver"
	"github.com/pedropereiraassis/full-cycle/microsservices/balances/pkg/kafka"
)

type BalanceUpdatedOutputDTO struct {
	AccountIDFrom      string  `json:"accountIdFrom"`
	AccountIDTo        string  `json:"accountIdTo"`
	BalanceAccountFrom float64 `json:"balanceAccountFrom"`
	BalanceAccountTo   float64 `json:"balanceAccountTo"`
}

type MessageValue struct {
	Name    string
	Payload BalanceUpdatedOutputDTO
}

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "balances_db", "3306", "balances"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	configMap := ckafka.ConfigMap{
		"bootstrap.servers": "kafka:29092",
		"group.id":          "wallet",
	}
	topics := []string{"balances"}
	kafkaConsumer := kafka.NewConsumer(&configMap, topics)

	msgChan := make(chan *ckafka.Message)
	go func() {
		if err := kafkaConsumer.Consume(msgChan); err != nil {
			fmt.Println(err)
		}
		fmt.Println("Kafka consumer has been started")
	}()

	accountDb := database.NewAccountDB(db)

	updateAccountBalanceUseCase := update_account_balance.NewUpdateAccountBalanceUseCase(accountDb)
	go func() {
		for msg := range msgChan {
			var messageValue MessageValue
			var balanceUpdatedOutputDTO BalanceUpdatedOutputDTO
			var inputDto update_account_balance.UpdateAccountBalanceInputDTO
			if err := json.Unmarshal(msg.Value, &messageValue); err != nil {
				fmt.Printf("Error unmarshalling message: %v", err)
				continue
			}
			balanceUpdatedOutputDTO = messageValue.Payload

			inputDto.AccountID = balanceUpdatedOutputDTO.AccountIDFrom
			inputDto.Balance = balanceUpdatedOutputDTO.BalanceAccountFrom
			updateAccountBalanceUseCase.Execute(inputDto)

			inputDto.AccountID = balanceUpdatedOutputDTO.AccountIDTo
			inputDto.Balance = balanceUpdatedOutputDTO.BalanceAccountTo
			updateAccountBalanceUseCase.Execute(inputDto)
		}
	}()

	getAccountBalanceUseCase := get_account_balance.NewGetAccountBalanceUseCase(accountDb)

	webserver := webserver.NewWebServer(":3003")

	accountHandler := web.NewWebAccountHandler(*getAccountBalanceUseCase)

	webserver.Addhandler("/balances/{accountId}", accountHandler.GetAccountBalance)

	fmt.Println("Server is running")
	webserver.Start()
}
