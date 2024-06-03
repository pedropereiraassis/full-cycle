# Event Driven Architecture Challenge

## Run the containers:

```
docker compose up -d --build
```

## Test applications:
Use file `/api/client.http` inside `/balances` to get first account balance. And use file `/api/client.http` inside 
`/wallet_core` to make the transaction. Then check the account balances to see the updates.