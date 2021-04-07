import { Client } from 'pg';

import config from '../../config.js';

import { UserInterface } from './../models/user'
import { generateUserId } from './../helpers';
import messages from './../messages';


const client = new Client({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// TO DO: refactor
const updateQuery = (body): Array<Array<string>> => {
  const { id, ...rest } = body;
  const query = ['UPDATE Users'];
  query.push('SET');
  const set = [];
  const values = [];
  const paramsLength = Object.keys(body).length;
  Object.entries(rest).forEach(function ([key, value], i) {
    set.push(key + ' = ($' + (i + 1) + ')');
    values.push(value);
  });
  values.push(id);
  query.push(set.join(', '));
  query.push('WHERE id = ' + '($' + (paramsLength) + ')');
  return [query, values];
}

export const getUsers = (): Promise<Array<UserInterface>> => {
  return new Promise((resolve, reject) => {
    client.query('SELECT * from Users', (err, res) => {
      if (err) return reject(err);
      return resolve(res.rows);
    });
  })
}

export const createUser = ({ login, password, age, isDeleted }): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.query(
      'INSERT INTO Users(id, login, password, age, isDeleted)VALUES($1, $2, $3, $4, $5) RETURNING *',
      [generateUserId(), login, password, age, isDeleted],
      (err) => {
        if (err) return reject(err + messages.sthWentWrong);
        return resolve(messages.savedSuccessfully);
      });
  })
}

export const updateUser = (body): Promise<string> => {
  const [query, values] = updateQuery(body);
  return new Promise((resolve, reject) => {
    client.query(query.join(' '), values,
      (err) => {
        if (err) return reject(err);
        return resolve(messages.updatedSuccessfully);
      });
  });
}

export const deleteUser = (body): Promise<string> => {
  const { id } = body;
  return new Promise((resolve, reject) => {
    client.query('UPDATE Users SET isDeleted = ($1) WHERE id = ($2)', [true, id],
      (err) => {
        if (err) return reject(err);
        return resolve(messages.deletedSuccessfully);
      });
  });
}

export const getUserById = (id): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.query('SELECT login from Users WHERE id = ($1)',
      [id],
      (err, res) => {
        if (err) return reject(err);
        return resolve(res.rows[0].login);
      });
  });
}

export const connect = (): void => client.connect();
export const disconnect = (): void => client.end();