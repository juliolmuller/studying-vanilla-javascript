// eslint-disable-next-line no-multi-assign
window.jQuery = window.$ = require('jquery')
require('bootstrap')
require('admin-lte')

const UserController = require('./controllers/UserController')

new UserController('#users-table', '#create-user-form', '#edit-user-form')
