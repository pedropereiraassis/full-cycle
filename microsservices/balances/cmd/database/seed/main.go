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

	rows, err := db.Query("SELECT id FROM clients WHERE id IN ('70a8fc6c-7a81-417d-b9b8-2602d9c82db6', '24f3e6e7-1b3d-41af-b233-839577f7a3ed')")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	if !rows.Next() {
		_, err = db.Exec(`
					INSERT INTO clients (id, name, created_at) VALUES
					('70a8fc6c-7a81-417d-b9b8-2602d9c82db6', 'John Doe', '2024-06-03'),
					('24f3e6e7-1b3d-41af-b233-839577f7a3ed', 'Jane Doe', '2024-06-03');
			`)
		if err != nil {
			log.Fatal(err)
		}
	}

	rows, err = db.Query("SELECT id FROM accounts WHERE id IN ('1a063b22-e24f-4324-9bd7-c68998e1c555', '0dc7947e-a71d-4e5b-a1cd-10e3eb8ba2d2')")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	if !rows.Next() {
		_, err = db.Exec(`
					INSERT INTO accounts (id, client_id, balance, created_at) VALUES
					('1a063b22-e24f-4324-9bd7-c68998e1c555', '70a8fc6c-7a81-417d-b9b8-2602d9c82db6', 1000, '2024-06-03'),
					('0dc7947e-a71d-4e5b-a1cd-10e3eb8ba2d2', '24f3e6e7-1b3d-41af-b233-839577f7a3ed', 1000, '2024-06-03');
			`)
		if err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("Seeds executed successfully")
}
