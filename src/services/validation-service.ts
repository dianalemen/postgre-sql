const { body } = require('express-validator')

interface userValidationIntarface {
  [key: string]: (str) => any[]
}
const User: userValidationIntarface = {};

const minAge = 4;
const maxAge = 130;

User.validate = (method) => {
  switch (method) {
    case 'createUser': {
      return [
        body('login').exists(),
        body('password').exists().custom(value => value.match(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/)),
        body('age').exists().custom(value => value >= minAge && value <= maxAge),
        body('isDeleted').exists().isBoolean()
      ]
    }
  }
}

module.exports = User;