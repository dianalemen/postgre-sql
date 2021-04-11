const db = require('./../services/db-connection-service');
const { validationResult } = require('express-validator');

const { getActiveUserLogins } = require('./../helpers');

const User = {
  getActiveUserLogins: async (req, res) => {
    const users = await db.getUsers();
    const activeUserLogins = getActiveUserLogins(users);
    res.send(activeUserLogins);
  },
  getUserById: async (req, res) => {
    const result = await db.getUserById(req.query.id);
    res.send(result[0].login);
  },
  createUser: async (req, res) => {
    const result = validationResult(req).errors.length
      ? validationResult(req).errors.reduce((acc, curr) => {
        return acc + ' ' + curr.param + ' ' + curr.msg;
      }, '')
      : await db.createUser(req.body);
    res.send(result);
  },
  updateUser: async (req, res) => {
    const result = await db.updateUser(req.body);
    res.send(result);
  },
  deleteUser: async (req, res) => {
    const result = await db.deleteUser(req.body);
    res.send(result);
  },
  getUsersBySubStrAndLimit: async (req, res) => {
    let users = await db.getUsersBySubStrAndLimit(req.query);
    res.send(users);
  }
}

module.exports = User;