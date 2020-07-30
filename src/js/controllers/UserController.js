const User = require('../models/User')
const { STORAGE } = require('../constants')

module.exports = class UserController {

  constructor(tableSelector, createUserFormSelector, editUserFormSelector = createUserFormSelector) {
    this.table = document.querySelector(`${tableSelector} tbody`)
    this.createUserBox = document.querySelector(createUserFormSelector)
    this.editUserBox = document.querySelector(editUserFormSelector)
    ;[this.createUserForm] = this.createUserBox.getElementsByTagName('form')
    ;[this.editUserForm] = this.editUserBox.getElementsByTagName('form')

    this.addEventOnCancel()
    this.addEventOnSubmit()

    this.refreshDisplayedData()
  }

  addEventOnCancel() {
    document.querySelectorAll('.btn-form-cancel').forEach((button) => {
      button.addEventListener('click', () => {
        button.form.reset()
        this.displayNewUserForm(true)
      })
    })
  }

  addEventOnSubmit() {
    [this.createUserForm, this.editUserForm].forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault()
        const userId = form.dataset.userId ? parseInt(form.dataset.userId, 10) : undefined
        this.submit(userId)
      })
    })
  }

  submit(userId) {
    const form = userId ? this.editUserForm : this.createUserForm
    const button = form.querySelector('[type=submit]')

    button.disabled = true
    this.resetErrors()

    const user = this.getDataFromForm(form)
    user.id = userId

    if (!user.hasErrors()) {
      this._getPhoto(form).then((content) => {
        user.photo = content
        this.saveUser(user)
        form.reset()
        delete form.dataset.userId
        this.displayNewUserForm(true)
      // eslint-disable-next-line no-console
      }, console.error)
    } else {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const err in user.errors) {
        // eslint-disable-next-line no-console
        console.log(`Error in '${err}' => ${user.errors[err]}`)
      }
    }

    button.disabled = false
  }

  resetErrors() {
    [this.createUserForm, this.editUserForm].forEach((form) => {
      form.querySelectorAll('.has-error').forEach((field) => {
        field.classList.remove('has-error')
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  _getPhoto(form) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      const hiddenPath = form.querySelector('input[type=hidden][name=photo]').value
      const [file] = form.querySelector('input[type=file]').files

      fileReader.onload = () => resolve(fileReader.result)
      fileReader.onerror = () => (error) => reject(error)

      if (file) {
        fileReader.readAsDataURL(file)
      } else {
        resolve(hiddenPath)
      }
    })
  }

  // eslint-disable-next-line class-methods-use-this
  getDataFromForm(form) {
    const user = {}

    form.querySelectorAll('[name]').forEach((field) => {
      switch (field.type) {
        case 'radio':
          if (field.checked) { user[field.name] = field.value }
          break
        case 'checkbox':
          user[field.name] = field.checked
          break
        default:
          user[field.name] = field.value
      }
    })

    return new User(user)
  }

  saveUser(user) {
    const userIndex = STORAGE.indexOf(user.id, '_id')

    if (userIndex >= 0) {
      STORAGE.update(userIndex, user)
    } else {
      STORAGE.insert(user)
    }

    this.refreshDisplayedData()
  }

  displayNewUserForm(visible) {
    if (visible) {
      this.editUserBox.style.display = 'none'
      this.createUserBox.style.display = 'block'
    } else {
      this.createUserBox.style.display = 'none'
      this.editUserBox.style.display = 'block'
    }
  }

  refreshDisplayedData() {
    this.table.innerHTML = ''

    let usersCount = 0
    let adminsCount = 0

    STORAGE.selectAll().forEach((userObj) => {
      // Remove '_' from User properties
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const attribute in userObj) {
        userObj[attribute.replace('_', '')] = userObj[attribute]
      }

      const user = new User(userObj)
      usersCount++

      if (user.admin) {
        adminsCount++
      }

      const tr = document.createElement('tr')
      tr.dataset.userId = user.id
      tr.innerHTML = user.getRowContent()
      tr.querySelector('.btn-edit').addEventListener('click', () => {
        this.editUserForm.dataset.userId = user.id
        this.editUserForm.querySelectorAll('[name]').forEach((field) => {
          if (user[field.name]) {
            switch (field.type) {
              case 'file':
                break
              case 'radio':
                field.checked = (field.value === user[field.name])
                break
              case 'checkbox':
                field.checked = user[field.name]
                break
              default:
                field.value = user[field.name]
            }
          }
        })

        this.displayNewUserForm(false)
      })
      tr.querySelector('.btn-delete').addEventListener('click', () => {
        // eslint-disable-next-line no-alert
        if (confirm(`Are you sure you want to delete '${user.name}'?`)) {
          STORAGE.delete(STORAGE.indexOf(user.id, '_id'))
          this.refreshDisplayedData()
        }
      })

      this.table.appendChild(tr)
    })

    document.getElementById('status-all-users').innerHTML = usersCount
    document.getElementById('status-admins').innerHTML = adminsCount
  }
}
