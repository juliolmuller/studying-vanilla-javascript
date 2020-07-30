const Storage = require('./utils/Storage')

const REQUIRED_DATA = [
  'password',
  'email',
  'name',
]

const STORAGE = new Storage('users', localStorage)

module.exports = { REQUIRED_DATA, STORAGE }
