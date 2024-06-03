package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(balances_db:3306)/balances")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS clients (
				id VARCHAR(255) PRIMARY KEY,
				name VARCHAR(255),
				created_at date
			);
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS accounts (
				id VARCHAR(255) PRIMARY KEY,
				client_id VARCHAR(255),
				balance int,
				created_at date
			);
    `)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Migrations executed successfully")
}
