
class User {

  constructor(userData) {
    //Object.assign(this, userData)
    this._errors = []
    this.name = userData.name
    this.gender = userData.gender
    this.birth = userData.birth
    this.country = userData.country
    this.email = userData.email
    this.password = userData.password
    this.photo = userData.photo
    this.admin = userData.admin
    this.register = userData.register || new Date()
  }

  static feedTemplate(htmlRow, user) {
    htmlRow.innerHTML = `
      <td><img src="${user.photo}" alt="User Image" class="img-circle img-sm"></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.admin ? 'Yes' : 'No'}</td>
      <td>${user.register}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Edit</button>
        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Delete</button>
      </td>
    `
  }

  isValid() {

    // Declarar constantes locais
    const mandatoryFields = ['name', 'email', 'password']
    
    // Cerificar se campos obrigatórios foram definidos
    mandatoryFields.forEach(field => {
      if (this[field] === undefined) {
        this._errors.push({
          'field': document.querySelector(`[name=${field}]`),
          'message': `Field "${field}" not filled out.`
        })
      }
    })

    // Avaliar se objeto contém erros
    return this.errors.length ? false : true
  }

  set name(string) {

    // Tratar valor recebido
    string = string.trim()

    // Validar valor e gravar erro
    if (!string) {
      this._errors.push({
        'field': document.querySelector('[name=name]'),
        'message': 'No "name" provided.'
      })
    } else if (!Utils.isName(string)) {
      this._errors.push({
        'field': document.querySelector(`[name=name]`),
        'message': `Field "name" contains invalid characters.`
      })
    }

    // Atribuir valor às propriedades do objeto
    this._name = string
  }

  get name() {
    return this._name
  }

  set gender(char) {
    this._gender = char
  }

  get gender() {
    return this._gender
  }

  set birth(date) {
    this._birth = date
  }

  get birth() {
    return this._birth
  }

  set country(string) {
    this._country = string
  }

  get country() {
    return this._country
  }

  set email(string) {

    // Tratar valor recebido
    string = string.trim()

    // Validar valor e gravar erro
    if (!string) {
      this._errors.push({
        'field': document.querySelector('[name=email]'),
        'message': 'No "email" provided.'
      })
    } else if (!Utils.isEmail(string)) {
      this._errors.push({
        'field': document.querySelector('[name=email]'),
        'message': 'Field "email" contains invalid characters.'
      })
    }

    // Atribuir valor às propriedades do objeto
    this._email = string
  }

  get email() {
    return this._email
  }

  set password(string) {

    // Validar valor e gravar erro
    if (!string || !Utils.valPassword(string)) {
      this._errors.push({
        'field': document.querySelector('[name=password]'),
        'message': 'Field "password" was not filled out propperly.'
      })
    }

    // Atribuir valor às propriedades do objeto
    this._password = string
  }

  get errors() {
    return this._errors
  }

  get password() {
    return this._password
  }

  set photo(filePath) {
    this._photo = filePath
  }

  get photo() {
    return this._photo
  }

  set admin(boolean) {
    this._admin = boolean
  }

  get admin() {
    return this._admin
  }

  set register(date) {
    this._register = Date.parse(date) ? Utils.formatDate(date) : date
  }

  get register() {
    return this._register
  }
}
