import express from 'express';
import bodyParser from 'body-parser';
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

const app = express();
const port = process.env.PORT || 3001;

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

connect();

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.get('/user/:id?', (async (req, res) => {
  const result = await getUserById(req.query.id);
  res.send(result);
}))

router.get('/getAutoSuggestedUsers/:loginSubStr?/:limit?',
  async (req, res) => {
    console.log('here');
    let users = await getUsersBySubStrAndLimit(req.query);
    res.send(users);
  }
)

router.route('/users')
  .get(async (req, res) => {
    const users = await getUsers();
    const activeUserLogins = users
      .filter(user => !user.isdeleted)
      .map(user => user.login).join(', ');
    res.send(activeUserLogins);
  })
  .post(async (req, res) => {
    const result = await createUser(req.body);
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
