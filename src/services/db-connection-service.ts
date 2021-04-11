import { Client } from 'pg';

import config from '../../config.js';

import { UserInterface } from './../models/user'
import { generateUserId } from './../helpers';
const messages = require('./../messages');


const client = new Client({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const updateQuery = (body): Array<Array<string>> => {
  const { id, ...rest } = body;
  const set = [];
  const values = [];

  const paramsLength = Object.keys(body).length;

  Object.entries(rest).forEach(function ([key, value], i) {
    set.push(key + ' = ($' + (i + 1) + ')');
    values.push(value);
  });

  values.push(id);
  const query = [
    'UPDATE Users', 'SET',
    set.join(', '),
    'WHERE id = ' + '($' + (paramsLength) + ')'
  ];
  return [query, values];
}

const dbModule = {
  getUsers: (): Promise<Array<UserInterface>> => {
    return new Promise((resolve, reject) => {
      client.query('SELECT * from Users', (err, res) => {
        if (err) return reject(err);
        return resolve(res.rows);
      });
    })
  },
  createUser: ({ login, password, age, isDeleted }): Promise<string> => {
    return new Promise((resolve, reject) => {
      client.query(
        'INSERT INTO Users(id, login, password, age, isDeleted)VALUES($1, $2, $3, $4, $5) RETURNING *',
        [generateUserId(), login, password, age, isDeleted],
        (err) => {
          if (err) return reject(err + messages.sthWentWrong);
          return resolve(messages.savedSuccessfully);
        });
    })
  },
  updateUser: (body): Promise<string> => {
    const [query, values] = updateQuery(body);
    return new Promise((resolve, reject) => {
      client.query(query.join(' '), values,
        (err) => {
          if (err) return reject(err);
          return resolve(messages.updatedSuccessfully);
        });
    });
  },
  deleteUser: (body): Promise<string> => {
    const { id } = body;
    return new Promise((resolve, reject) => {
      client.query('UPDATE Users SET isDeleted = ($1) WHERE id = ($2)', [true, id],
        (err) => {
          if (err) return reject(err);
          return resolve(messages.deletedSuccessfully);
        });
    });
  },
  getUserById: (id): Promise<Array<UserInterface>> => {
    return new Promise((resolve, reject) => {
      client.query('SELECT login from Users WHERE id = ($1)',
        [id],
        (err, res) => {
          if (err) return reject(err);
          return resolve(res.rows);
        });
    });
  },
  getUsersBySubStrAndLimit: ({ loginSubStr, limit }): Promise<string> => {
    return new Promise((resolve, reject) => {
      client.query('SELECT login from Users WHERE login LIKE $1 LIMIT $2',
        ['%' + loginSubStr + '%', limit],
        (err, res) => {
          if (err) return reject(err);
          return resolve(res.rows);
        });
    });
  },
  connect: (): void => client.connect(),
  disconnect: (): void => client.end()
}

module.exports = dbModule;
