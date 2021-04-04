import express from 'express';
import { Client } from 'pg';

import config from '../config.js';

const app = express();
const port = process.env.PORT || 3001;

const client = new Client({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// client.query('INSERT INTO Users(id, login, password, age, isDeleted)VALUES($1, $2, $3, $4, $5) RETURNING *', ["2", "Emma", "gg", 30, false], (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
// });

client.query('SELECT * from Users', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
