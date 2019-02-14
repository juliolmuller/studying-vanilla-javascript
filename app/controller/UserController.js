
/**
 * Controller class for the user data flowing through the forms to the table and vice-versa.
 */
class UserController {

  /**
   * Links JavaScript codes with the HTML elements (DOM).
   * @param {string} tableId Receives the table ID (tag 'table') where the processed data will lay down. It must include a 'tbody' tag.
   * @param {string} boxFormCreateId Receives the container ID (tag 'div', 'section' or other) which includes all the inputs and buttons
   *                                 of the 'New User Form'.
   * @param {string} boxFormEditId Optionally rReceives the container ID (tag 'div', 'section' or other) which includes all the inputs
   *                               and buttons of the 'Edit User Form'. If it is not provided, it is understood that the for for editing
   *                               is the same used for new entries (boxFormCreateId).
   */
  constructor(tableId, boxFormCreateId, boxFormEditId = boxFormCreateId) {
    
    // Save DOM references as object properties
    this.table = document.getElementById(tableId).getElementsByTagName('tbody')[0]
    this.boxFormCreate = document.getElementById(boxFormCreateId)
    this.boxFormEdit = document.getElementById(boxFormEditId)
    this.formCreate = this.boxFormCreate.getElementsByTagName('form')[0]
    this.formEdit = this.boxFormEdit.getElementsByTagName('form')[0]

    // Set up the main events for the forms
    this.addEventOnCancel()
    this.addEventOnSUbmit()

    // Refresh list of existing users and the status boards
    this.refreshDisplayedData()
  }

  /**
   * Set up event when cancelling form input.
   */
  addEventOnCancel() {
    document.querySelectorAll('.btn-form-cancel').forEach(button => {
      button.addEventListener('click', () => {
        button.form.reset()
        this.displayNewUserForm(true)
      })
    })
  }

  /**
   * Set up event when form is submited.
   */
  addEventOnSUbmit() {
    Array.of(this.formCreate, this.formEdit).forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault()
        const userId = form.dataset.userId ? parseInt(form.dataset.userId) : undefined
        this.submit(userId)
      })
    })
  }

  /**
   * Submits the data for processing. If validation allows, save data to the storage and reflects it on the table.
   * @param {number} userId Índice do usuário na tabela ('sectionRowIndex')
   */
  submit(userId) {

    // Identify which form is being submitted
    const form = userId ? this.formEdit : this.formCreate

    // Disable sumition button while data is being processed
    const button = form.querySelector('[type=submit]')
    button.disabled = true

    // Reset errors flags previously displayed
    this.resetErrors()

    // Collect user data from form and instance a 'User' object
    const user = this.getDataFromForm(form)
    user.id = userId

    // Check if 'User' object has errors
    if (!user.hasErrors()) {

      // Process profile picture file
      this.getPhoto(form).then(

        // If file is successfully processed, save it
        (content) => {
// TODO Refatorar funções de foto para o MODEL
          user.photo = content
          this.saveUser(user)
          form.reset()
          delete form.dataset.userId
          
          // Ensure 'New User Form' is being displayed
          this.displayNewUserForm(true)
        },

        // If file processing inccur in some error, display it in the console
        (error) => {
          console.error(error);
        }
      )
      
    // Display data validation inconsistencies
    } else {
      for (let err in user.errors) {
        //form.querySelector(`[name=${user.err}]`).parentElement.classList.add('has-error')
// TODO:Exibir mensagem de erro na tela
        console.log(`Error in '${err}' => ${user.errors[err]}`)
      }
    }

    // Enable submition button
    button.disabled = false
  }

  /**
   * Removes class 'has-error' from previously validated fields
   */
  resetErrors() {
    Array.of(this.formCreate, this.formEdit).forEach(form => {
      form.querySelectorAll('.has-error').forEach(field => {
        field.classList.remove('has-error')
      })
    })
  }

  /**
   * Captures the uploaded file and convert it to be used locally.
   * @param {*} form References the form where the file was uploaded.
   */
  getPhoto(form) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      const hiddenPath = form.querySelector('input[type=hidden][name=photo]').value
      const file = form.querySelector('input[type=file]').files[0]
      fileReader.onload = () => resolve(fileReader.result)
      fileReader.onerror = () => error => reject(error)
      file ? fileReader.readAsDataURL(file) : resolve(hiddenPath)
    })
  }

  /**
   * Captures user data from form inputs and convert it to an instance of User class.
   * @param {*} form References the form where the data was inserted/updated..
   */
  getDataFromForm(form) {

    // Define simple object to temporarily keep the data
    const user = {}

    // Iterate over elements with attribute 'name' to capture their values
    form.querySelectorAll('[name]').forEach(field => {

      // Save values according to input type
      switch (field.type) {
        case 'radio':
          if (field.checked) user[field.name] = field.value
          break
        case 'checkbox':
          user[field.name] = field.checked
          break
        default:
          user[field.name] = field.value
      }  
    })

    // Instance object 'User' and return it
    return new User(user)
  }

  /**
   * Saves new/updated user to the browser storage.
   * @param {User} user References the object with user data.
   */
  saveUser(user) {

    // Check if it is a new or an existing user
    const userIndex = STORAGE.indexOf(user.id, '_id')

    // If an index was found, update record
    if (userIndex > -1) {
      STORAGE.update(userIndex, user)

    // If no index was found, insert new record
    } else {
      STORAGE.insert(user)
    }

    // Refresh list of existing users and the status boards
    this.refreshDisplayedData()
  }

  /**
   * Switch visibity between forms.
   * @param {boolean} visible Sets the 'New User Form' to visible if TRUE.
   */
  displayNewUserForm(visible) {
    if (visible) {
      this.boxFormEdit.style.display = 'none'
      this.boxFormCreate.style.display = 'block'
    } else {
      this.boxFormCreate.style.display = 'none'
      this.boxFormEdit.style.display = 'block'
    }
  }

  /**
   * Refresh list of users based on browser storage and update status blocks.
   */
  refreshDisplayedData() {

    // Clear current content of the target table
    this.table.innerHTML = ''

    // Declare variables to count number of users
    let usersCount = 0, adminsCount = 0

    // Iterate over users in browser storage and add a new line ('tr' elment) to each one in the table
    STORAGE.selectAll().forEach(userObj => {

      // Remove '_' from User properties
      for (let attribute in userObj) {
        userObj[attribute.replace('_', '')] = userObj[attribute]
      }

      // Convert simple object to an class instaced object
      const user = new User(userObj)

      // COunt users and administrators
      usersCount++
      if (user.admin) adminsCount++
      
      // Create new 'tr' element to receive retrieved user data
      const tr = document.createElement('tr')

      // Assign user ID to the element
      tr.dataset.userId = user.id

      // Get HTML template to set the data
      tr.innerHTML = user.getRowContent()

      // Add event to button 'edit'
      tr.querySelector('.btn-edit').addEventListener('click', () => {
        this.formEdit.dataset.userId = user.id
        this.formEdit.querySelectorAll(`[name]`).forEach(field => {
          if (user[field.name]) {
            switch (field.type) {
              case 'file':
                break
              case 'radio':
                if (field.value == user[field.name]) field.checked = true
                break
              case 'checkbox':
                field.checked = user[field.name]
                break
              default:
                field.value = user[field.name]
            }
          }
        })
  
        // Hide 'Edit User Form' and display 'New User Form'
        this.displayNewUserForm(false)
      })
  
      // Add event to button 'delete'
      tr.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete '${user.name}'?`)) {
          STORAGE.delete(STORAGE.indexOf(user.id, '_id'))
          this.refreshDisplayedData()
        }
      })

      // Insert created element to the DOM
      this.table.appendChild(tr)
    })

    // Update status board
    document.getElementById('status-all-users').innerHTML = usersCount
    document.getElementById('status-admins').innerHTML = adminsCount
  }
}
