export { };
const express = require('express');
const router = require('./route');

const app = express();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/', router);
