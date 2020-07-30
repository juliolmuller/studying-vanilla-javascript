const Utils = require('../Utils/Utils')
const { REQUIRED_DATA } = require('../constants')

module.exports = class User {

  constructor(userData) {
    this._errors = {}
    this.name = userData.name
    this.gender = userData.gender
    this.birth = userData.birth
    this.country = userData.country
    this.email = userData.email
    this.password = userData.password
    this.photo = userData.photo
    this.admin = userData.admin
    this.registration = userData.registration
    this.id = userData.id
  }

  // eslint-disable-next-line class-methods-use-this
  isRequired(field) {
    return (REQUIRED_DATA.indexOf(field) >= 0)
  }

  getRowContent() {
    return `
      <td><img src="${this.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${this.name}</td>
      <td>${this.email}</td>
      <td>${this.admin ? 'Yes' : 'No'}</td>
      <td>${Utils.formatDate(this.registration, 'dd/MM/yyyy hh:mm')}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Edit</button>
        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Delete</button>
      </td>
    `
  }

  hasErrors() {
    // eslint-disable-next-line no-restricted-syntax
    for (const error in this.errors) {
      if (this._errors[error]) {
        return true
      }
    }
    return false
  }

  setNewError(field, message) {
    this._errors[field] = message
  }

  get errors() {
    return this._errors
  }

  set name(string) {
    const field = 'name'

    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User name is mandatory')
    } else if (typeof string === 'string') {
      // eslint-disable-next-line no-param-reassign
      string = string.trim()

      if (!Utils.isName(string)) {
        this.setNewError(field, 'User name contains invalid characters')
      }
    }

    this._name = string
  }

  get name() {
    return this._name
  }

  set gender(char) {
    const field = 'gender'

    if (!char && this.isRequired(field)) {
      this.setNewError(field, 'No gender selected')
    }

    this._gender = char
  }

  get gender() {
    return this._gender
  }

  set birth(date) {
    const field = 'birth'

    if (!date && this.isRequired(field)) {
      this.setNewError(field, 'Date of user birth is mandatory')
    }

    this._birth = date
  }

  get birth() {
    return this._birth
  }

  set country(string) {
    const field = 'country'

    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User location is mandatory')
    }

    this._country = string
  }

  get country() {
    return this._country
  }

  set email(string) {
    const field = 'email'

    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User email is mandatory')
    } else if (typeof string === 'string') {
      // eslint-disable-next-line no-param-reassign
      string = string.trim()

      if (!Utils.isEmail(string)) {
        this.setNewError(field, 'Email address contains invalid characters')
      }
    }

    this._email = string
  }

  get email() {
    return this._email
  }

  set password(string) {
    const field = 'password'

    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'Password is mandatory')
    } else if (typeof string !== 'string') {
      this.setNewError(field, 'Password does not fit with the required format')
    }

    this._password = string
  }

  get password() {
    return this._password
  }

  set photo(filePath) {
    const field = 'photo'

    if (!filePath && this.isRequired(field)) {
      this.setNewError(field, 'No user profile image provided')
    }

    this._photo = filePath
  }

  get photo() {
    return this._photo
  }

  set admin(boolean) {
    const field = 'admin'

    if (!boolean && this.isRequired(field)) {
      this.setNewError(field, 'Field "Administrator" must be checked')
    }

    this._admin = boolean
  }

  get admin() {
    return this._admin
  }

  set registration(date) {
    this._registration = date ? new Date(Date(`${date}T00:00:00.000Z`)) : new Date(Date(`${Date.now()}T00:00:00.000Z`))
  }

  get registration() {
    return this._registration
  }

  set id(key) {
    this._id = key || this._registration.getTime()
  }

  get id() {
    return this._id
  }
}
