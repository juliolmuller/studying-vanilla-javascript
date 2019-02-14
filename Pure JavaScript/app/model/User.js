
/**
 * Base class with main user data to be managed.
 * 
 */
class User {

  /**
   * Convert simple object to class instanced object.
   * @param {*} userData Object with user data to be imported.
   */
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

  /**
   * Evaluates whether a given data is required as per business model.
   * @param {string} field Field name to be evaluated.
   */
  isRequired(field) {
    return (REQUIRED_DATA.indexOf(field) > -1)
  }

  /**
   * Returns the HTML string to be inserted into a row with user data.
   */
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

  /**
   * Returns the boolean evaluation for the existance of errors.
   */
  hasErrors() {
    for (let error in this.errors) {
      if (this._errors.hasOwnProperty(error)) {
        return true
      }
    }
    return false
  }

  /**
   * Adds a new entry in the list of errors.
   * @param {string} field Name of the field which contains error.
   * @param {string} message String with details of the error.
   */
  setNewError(field, message) {
    this._errors[field] = message
  }

  /**
   * Returns the list of errors found to the object.
   */
  get errors() {
    return this._errors
  }

  /**
   * Sets the 'name' property.
   * @param {string} string
   */
  set name(string) {
    const field = 'name'

    // Checks if the parameter is defined and if it is required
    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User name is mandatory')

    // Checks if it is a string and remove blank spaces
    } else if (typeof string == 'string') {
      string = string.trim()

      // Validate name
      if (!Utils.isName(string)) {
        this.setNewError(field, 'User name contains invalid characters')
      }
    }

    // Attribute property to the object
    this._name = string
  }

  /**
   * Returns the 'name' property.
   */
  get name() {
    return this._name
  }

  /**
   * Sets the 'gender' property.
   * @param {string} char
   */
  set gender(char) {
    const field = 'gender'

    // Checks if the parameter is defined and if it is required
    if (!char && this.isRequired(field)) {
      this.setNewError(field, 'No gender selected')
    }

    // Attribute property to the object
    this._gender = char
  }

  /**
   * Returns the 'gender' property.
   */
  get gender() {
    return this._gender
  }

  /**
   * Sets the 'birth' property.
   * @param {string} date
   */
  set birth(date) {
    const field = 'birth'

    // Checks if the parameter is defined and if it is required
    if (!date && this.isRequired(field)) {
      this.setNewError(field, 'Date of user birth is mandatory')
    }

    // Attribute property to the object
    this._birth = date
  }

  /**
   * Returns the 'birth' property.
   */
  get birth() {
    return this._birth
  }

  /**
   * Sets the 'country' property.
   * @param {string} string
   */
  set country(string) {
    const field = 'country'

    // Checks if the parameter is defined and if it is required
    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User location is mandatory')
    }

    // Attribute property to the object
    this._country = string
  }

  /**
   * Returns the 'country' property.
   */
  get country() {
    return this._country
  }

  /**
   * Sets the 'email' property.
   * @param {string} string
   */
  set email(string) {
    const field = 'email'

    // Checks if the parameter is defined and if it required
    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'User email is mandatory')

    // Checks if it is a string and remove blank spaces
    } else if (typeof string == 'string') {
      string = string.trim()

      // Validate name
      if (!Utils.isEmail(string)) {
        this.setNewError(field, 'Email address contains invalid characters')
      }
    }

    // Attribute property to the object
    this._email = string
  }

  /**
   * Returns the 'email' property.
   */
  get email() {
    return this._email
  }

  /**
   * Sets the 'password' property.
   * @param {string} string
   */
  set password(string) {
    const field = 'password'

    // Checks if the parameter is defined and if it required
    if (!string && this.isRequired(field)) {
      this.setNewError(field, 'Password is mandatory')

    // Checks if it is a string and validate it
    } else if (!typeof string == 'string' || !Utils.valPassword(string)) {
      this.setNewError(field, 'Password does not fit with the required format')
    }

    // Attribute property to the object
    this._password = string
  }

  /**
   * Returns the 'password' property.
   */
  get password() {
    return this._password
  }

  /**
   * Sets the 'photo' property.
   * @param {string} filePath
   */
  set photo(filePath) {
    const field = 'photo'

    // Checks if the parameter is defined and if it is required
    if (!filePath && this.isRequired(field)) {
      this.setNewError(field, 'No user profile image provided')
    }

    // Attribute property to the object
    this._photo = filePath
  }

  /**
   * Returns the 'photo' property.
   */
  get photo() {
    return this._photo
  }

  /**
   * Sets the 'admin' property.
   * @param {boolean} boolean
   */
  set admin(boolean) {
    const field = 'admin'

    // Checks if the parameter is defined and if it is required
    if (!boolean && this.isRequired(field)) {
      this.setNewError(field, 'Field "Administrator" must be checked')
    }

    // Attribute property to the object
    this._admin = boolean
  }

  /**
   * Returns the 'admin' property.
   */
  get admin() {
    return this._admin
  }

  /**
   * Sets the 'registration' property.
   * @param {string} string
   */
  set registration(date) {
    this._registration = date ? new Date(Date(`${date}T00:00:00.000Z`)) : new Date(Date(`${Date.now()}T00:00:00.000Z`))
  }

  /**
   * Returns the 'registration' property.
   */
  get registration() {
    return this._registration
  }

  /**
   * Sets the 'key ID' property based on the date of registration.
   * @param {string} string
   */
  set id(key) {
    this._id = key || this._registration.getTime()
  }

  /**
   * Returns the 'key ID' property.
   */
  get id() {
    return this._id
  }
}
