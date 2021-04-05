import { Client } from 'pg';

import config from '../../config.js';


const client = new Client({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// client.query('INSERT INTO Users(id, login, password, age, isDeleted)VALUES($1, $2, $3, $4, $5) RETURNING *', ["2", "Emma", "gg", 30, false], (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
// });

export const getUsers = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.query('SELECT * from Users', (err, res) => {
      if (err) return reject(err);
      return resolve(JSON.stringify(res.rows));
    });
  })
}

export const connect = (): void => client.connect();
export const disconnect = (): void => client.end();