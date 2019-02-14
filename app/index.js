
const fields = document.querySelectorAll('#form-user-create [name]')
fields[0].value = 'Julio'
fields[1].checked = true
fields[3].value = "1992-03-30"
fields[4].value = 'Brazil'
fields[5].value = 'julio@gmail.com'
fields[6].value = 'qwerty123'
fields[8].checked = true

const user = new UserController('users-table', 'box-user-create', 'box-user-edit')
