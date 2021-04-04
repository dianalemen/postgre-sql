const dotenv = require('dotenv').config();
const config = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL
};

module.exports = config;
