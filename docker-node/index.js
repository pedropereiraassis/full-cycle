const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db',
  database: 'nodedb',
  user: 'root',
  password: 'root',
});

connection.connect();

connection.query('CREATE TABLE IF NOT EXISTS users (id int auto_increment primary key, name varchar(100))');

const userNumber = Math.floor(Math.random() * 500);
const userName = `John ${userNumber}`;
connection.query(`INSERT INTO users (name) VALUES ('${userName}')`);

app.get('/', (_req, res) => {
  const users = [];

  connection.query('SELECT * FROM users', (_err, results) => {
    users.push(results.map((result) => result.name));
    res.send(`
      <h1>Full Cycle Rocks!</h1>
      <h2>List of users registered on database:</h2>
      <h3>${users}</h3>
    `);
  })

});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});