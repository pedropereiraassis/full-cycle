package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(wallet_core_db:3306)/wallet_core")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS clients (
				id VARCHAR(255) PRIMARY KEY,
				name VARCHAR(255),
				email VARCHAR(255),
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

	_, err = db.Exec(`
			CREATE TABLE IF NOT EXISTS transactions (
				id VARCHAR(255) PRIMARY KEY,
				account_id_from VARCHAR(255),
				account_id_to VARCHAR(255),
				amount int,
				created_at date
			);
    `)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Migrations executed successfully")
}
