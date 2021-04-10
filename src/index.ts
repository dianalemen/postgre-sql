import express from 'express';
import bodyParser from 'body-parser';
const { validationResult } = require('express-validator');
const User = require('./services/validation-service');

import {
  connect,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsersBySubStrAndLimit,
  disconnect
} from './services/db-connection-service'
import { getActiveUserLogins } from './helpers';
import messages from './messages';

const app = express();
const port = process.env.PORT || 3001;

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

connect();

router.use('/users', async (req, res, next) => {
  if (req.method === 'GET' || req.method == 'POST') {
    next();
  } else {
    const result = await getUserById(req.body.id);
    if (result.length) {
      next();
    } else {
      res.send(messages.userIsNotDefind);
    }
  }
})

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/user/:id?', (async (req, res) => {
  const result = await getUserById(req.query.id);
  res.send(result[0].login);
}))

router.get('/getAutoSuggestedUsers/:loginSubStr?/:limit?',
  async (req, res) => {
    let users = await getUsersBySubStrAndLimit(req.query);
    res.send(users);
  }
)

router.route('/users')
  .get(async (req, res) => {
    const users = await getUsers();
    const activeUserLogins = getActiveUserLogins(users);
    res.send(activeUserLogins);
  })
  .post(User.validate('createUser'), async (req, res) => {
    const result = validationResult(req).errors.length
      ? validationResult(req).errors.reduce((acc, curr) => {
        return acc + ' ' + curr.param + ' ' + curr.msg;
      }, '')
      : await createUser(req.body);
    res.send(result);
  })
  .put(async (req, res) => {
    const result = await updateUser(req.body);
    res.send(result);
  })
  .delete(async (req, res) => {
    const result = await deleteUser(req.body);
    res.send(result);
  })

//disconnect();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/', router);
