
/**
 * List of mandatory fields to have data.
 * @type {string[]}
 */
const REQUIRED_DATA = [
  'name',
  'email',
  'password'
]

/**
 * Instance of the browser storage which will keep the data.
 * @type {Storage}
 */
const STORAGE = new LocalStorage('users')
