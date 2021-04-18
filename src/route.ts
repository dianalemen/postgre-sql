export { };
const express = require('express');
const bodyParser = require('body-parser');
const UserValidationRule = require('./services/validation-service');
const UserController = require('./controllers/User');
const db = require('./services/db-connection-service');
const messages = require('./messages');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

db.connect();

router.use('/users', async (req, res, next) => {
  if (req.method === 'GET' || req.method == 'POST') {
    next();
  } else {
    const result = await db.getUserById(req.body.id);
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

router.get('/user/:id?', UserController.getUserById)

router.get('/getAutoSuggestedUsers/:loginSubStr?/:limit?',
  UserController.getUsersBySubStrAndLimit
)

router.route('/users')
  .get(UserController.getActiveUserLogins)
  .post(UserValidationRule.validate('createUser'), UserController.createUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser)

module.exports = router;
