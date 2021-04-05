import express from 'express';
import { connect, getUsers } from './services/db-connection-service'

const app = express();
const port = process.env.PORT || 3001;

const router = express.Router();

connect();

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.route('/users')
  .get(async (req, res) => {
    const users = await getUsers();
    res.send(users);
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/', router);
