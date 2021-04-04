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

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
