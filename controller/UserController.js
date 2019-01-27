
class UserController {

  /**
   * Construtor da classe, recebendo a referência para o tbody da tabela em que
   * os dados serão armazenados e os formulários de manipulação dos dados do 
   * usuário.
   * 
   * @param {String} tableId ID da tabela-alvo. Funcionará apenas se a tabela 
   *        tiver a tag 'tbody'.
   * @param {String} boxFormCreateId ID do compartimento que engloba o formulário
   *        de criação de usuário.
   * @param {String} boxFormEditId (opcional) ID do compartimento que engloba o 
   *        formulário de edição de usuário. Se nenhum valor for passado, 
   *        considera-se que o formulário de edição é o mesmo usado na inserção.
   */
  constructor(tableId, boxFormCreateId, boxFormEditId = boxFormCreateId) {
    
    // Salvar referência aos elementos HTML em atributos da classe
    this.table = document.querySelector(`#${tableId} tbody`)
    this.boxFormCreate = document.getElementById(boxFormCreateId)
    this.boxFormEdit = document.getElementById(boxFormEditId)
    this.formCreate = this.boxFormCreate.querySelector('form')
    this.formEdit = this.boxFormEdit.querySelector('form')

    // Definir eventos de clique para botões de 'save' e 'cancel'
    this.addEventOnCancel()
    this.addEventOnSUbmit()

    // Carregar lista de usuários do armazenamento local
    this.loadUsers()
    this.updateStatus()
  }

  /**
   * Adicionar eventos de cancelamento de formulários.
   */
  addEventOnCancel() {

    // Definir evento para quando o botão 'Cancel' é clicado
    document.querySelectorAll('.btn-form-cancel').forEach(button => {
      button.addEventListener('click', event => {
        button.form.reset()
        this.togglePanels()
      })
    })
  }

  /**
   * Adicionar eventos de submissão de formulários.
   */
  addEventOnSUbmit() {

    // Iterar sobre formulários, adicionando evento de 'submit'
    ;[this.formCreate, this.formEdit].forEach(form => form.addEventListener('submit', event => {
      
      // Prevenir atualização da página
      event.preventDefault()

      // Processar submissão, passando
      this.submit(this.formEdit.dataset.rowIndex)
    }))
  }

  /**
   * Executa a submissão dos dados efetivamente, coletando-os, tratando-os e
   * os colocando na tabela, em seus devidos lugares.
   * 
   * @param {Number} userIndex Índice do usuário na tabela ('sectionRowIndex')
   */
  submit(userIndex) {

    // Identificar formulário ativo ebotão de submissão

    const form = (userIndex === undefined) ? this.formCreate : this.formEdit
    const button = form.querySelector('[type=submit]')

    // Desabilitar botão de submissão enquanto a submissão é processada
    button.disabled = true

    // Remover sinalizadores de erros em inputs anteriormente ativados
    this.resetErrors()

    // Coletar dados do formulário ativo
    const userData = this.getValuesFromForm(form)

    // Avaliar se o objeto 'userData' não possui erros de validação (listados no atributo 'errors')
    if (userData.isValid()) {

      // Processar arquivo de foto
      this.getPhoto(form).then(
        (content) => {

          // Receber referência para foto
          userData.photo = content

          // Adicionar usuário à tabela
          this.createOrInsertUser(userData, userIndex)

          // Esvaziar inputs de formulário
          form.reset()

          // Esconder formulário de edição
          if (!(userIndex === undefined)) {
            delete this.formEdit.dataset.rowIndex
            this.togglePanels()
          }
        },
        
        // Na existência de erros no processamento da imagem, exibi-los no console
        (error) => {
          console.error(error);
        }
      )
      
    // Em caso de erros no formulário, alertar usuário
    } else {
      userData.errors.forEach(err => {
      
        // Adicionar classe de erros aos campos
        err.field.parentElement.classList.add('has-error')

        // TODO:
        // Exibir janelas de alerta
        console.log(err)
      })
    }

    // Reabilitar botão de submissão
    button.disabled = false
  }

  /**
   * Remover classes 'has-error' relacionada a inputs de formulários com erros de validação.
   */
  resetErrors() {
    ;[this.formCreate, this.formEdit].forEach(form => {
      form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'))
    })
  }

  /**
   * Captura o arquivo anexado e codifica-o para poder ser utilizado sem requisições/respostas.
   * 
   * @param {*} form Referência ao formulário que está enviando a foto.
   * @returns {Promise}
   */
  getPhoto(form) {
    return new Promise((resolve, reject) => {

      // Instanciar objeto 'FileReader' para uso do arquivo
      const fileReader = new FileReader()

      // Cópia oculta do local do arquivo
      const hiddenPath = form.querySelector('input[type=hidden][name=photo]').value

      // Salvar referência ao arquivo anexado ao input
      const file = form.querySelector('input[type=file]').files[0]

      // ? Tratar resultado Promise
      // TODO: entender funcionamento do Promise
      fileReader.onload = () => resolve(fileReader.result)
      fileReader.onerror = () => error => reject(error)

      // Retornar o arquivo carregado ou retornar arquivo padrão
      file ? fileReader.readAsDataURL(file) : resolve(hiddenPath)
    })
  }

  /**
   * Captura os dados do formulário, retornando um objeto User
   * 
   * @param {*} form Referência ao formulário que está enviando os dados.
   * @returns {User}
   */
  getValuesFromForm(form) {

    // Criar objeto temporário para armazenar
    const user = {}

    // Iterar sobre elementos 'input' e salvar seus devidos valores
    form.querySelectorAll('input[name], select[name]').forEach(field => {
      switch (field.type) {

        // Tratar inputs do tipo 'radio'
        case 'radio':
          if (field.checked) user[field.name] = field.value
          break

        // Tratar inputs do tipo 'checkbox'
        case 'checkbox':
          user[field.name] = field.checked
          break

        // Tratar demais inputs
        default:
          user[field.name] = field.value
      }  
    })

    // Retornar objeto 'User' com valores validados do formulário
    return new User(user)
  }

  /**
   * Adicionar elemento ao armazenamento local
   * 
   * @param {User} userData Referência ao formulário de origem dos dados.
   * @param {Number} userIndex Índice da linha sendo alterada.
   */
  createOrInsertUser(userData, userIndex) {

    // Criar linha para receber células com dados de novo usuário
    if (userIndex === undefined) {
      this.table.insertRow(-1)
      userIndex = this.table.rows.length - 1

      // Salvar dados no armazenamento local do navegador
      this.insert(userData)
    } else {
      this.update(userData, userIndex)
    }
    const tr = this.table.rows[userIndex]

    // organizar dados na linha da tabela
    this.updateRow(tr, userData, userIndex)

    // Atualizar status de número de usuários
    this.updateStatus(userData.admin)
  }

  /**
   * Efetivamente molda o elemento html para ser inserido na tabela
   * 
   * @param {*} htmlRow Referência ao elemento "TR" do HTML que conterá os dados.
   * @param {User} userData Objeto com os dados do usuário.
   * @param {Number} userIndex Índice da linha da tabela sendo modificado.
   */
  updateRow(htmlRow, userData, userIndex) {

    // Definir atributo 'dataset' para a linha
    htmlRow.dataset.user = JSON.stringify(userData)
  
    // Adicionar texto dentro do elemento
    User.feedTemplate(htmlRow, userData)

    // Adicionar evento ao botão 'edit'
    htmlRow.querySelector('.btn-edit').addEventListener('click', event => {

      // Converter DataSet em formato JSON
      const user = JSON.parse(htmlRow.dataset.user)

      // Determinar o índice do item recuperado da tabela
      this.formEdit.dataset.rowIndex = htmlRow.sectionRowIndex

      // Iterar sobre 'atributos' do objeto JSON para colocá-los nos respectivos campos do formulário
      for (let fieldName in user) {

        // Selecionar campo
        const field = this.formEdit.querySelector(`input[name=${fieldName.replace('_', '')}],select[name=${fieldName.replace('_', '')}]`)

        // Avaliar se o campo foi encontrado e se não é de arquivo
        if (field) {
          switch (field.type) {
            case 'file':
              break
            case 'radio':
              this.formEdit.querySelector(`input[name=${fieldName.replace('_', '')}][value=${user[fieldName]}]`).checked = true
              break
            case 'checkbox':
              field.checked = user[fieldName]
              break
            default:
              field.value = user[fieldName]
          }
        }
      }

      // Exibir formulário de edição
      this.togglePanels()
    })

    // Adicionar evento ao botão 'delete'
    htmlRow.querySelector('.btn-delete').addEventListener('click', event => {
      
      // COnfirmar exclusão de itens da tabela
      if (confirm(`Are you sure you want to delete '${userData.name}'?`)) {

        // Excluir dados do armazenamento local
        this.delete(userIndex)

        // Excluir linha selecionada
        htmlRow.remove()
        
        // Atualizar status de número de usuários
        this.updateStatus(userData.admin)
      }
    })
  }

  /**
   * Alternar entre os formulários visíveis ao usuário.
   */
  togglePanels() {
    if (this.boxFormEdit.style.display == 'none') {
      this.boxFormCreate.style.display = 'none'
      this.boxFormEdit.style.display = 'block'
    } else {
      this.boxFormEdit.style.display = 'none'
      this.boxFormCreate.style.display = 'block'
    }
  }

  /**
   * Atualizas número de usuários listados e quantidade de administradores.
   */
  updateStatus() {

    // Declarar variáveis contadoras
    let usersCount = 0, adminsCount = 0
    
    // Percorrer os itens da tabela
    ;[...this.table.children].forEach(tr => {

      // Incrementar número de usuários
      usersCount++

      // Incrementar número de administradores
      if (JSON.parse(tr.dataset.user)._admin) adminsCount++
    })
    
    // Atualiza quantidade nos elementos HTML
    document.getElementById('status-all-users').innerHTML = usersCount
    document.getElementById('status-admins').innerHTML = adminsCount
  }

  /**
   * Retornar a lista de usuários armazenados localmente.
   */
  getValuesFromStorage() {
    return localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : []
  }

  /**
   * Carregar dados de usuários armazenados localmente.
   */
  loadUsers() {

    // Recuperar storage existente ou criar uma nova
    const users = this.getValuesFromStorage()

    // Iterar sobre lista de usuários armazenados
    users.forEach(user => {
      for (let attribute in user) {
        user[attribute.replace('_', '')] = user[attribute]
      }
      const userData = new User(user)
      const userIndex = this.table.rows.length
      const tr = this.table.insertRow(-1)
      this.updateRow(tr, userData, userIndex)
    })
  }

  /**
   * Adicionar novo usuário ao armazenamento local.
   * 
   * @param {User} newUser Referência ao objeto com dados do usuário.
   */
  insert(newUser) {
    
    // Recuperar storage existente ou criar uma nova
    const users = this.getValuesFromStorage()

    // Adicionar novo usuário criado
    users.push(newUser)

    // Salvar lista em storage
    localStorage.setItem('users', JSON.stringify(users))
  }

  /**
   * Atualizar modificações em dados do usuário no armazenamento local.
   * 
   * @param {User} user Referência ao objeto com dados do usuário.
   * @param {Number} index Índice da linha do usuário sendo atualizado.
   */
  update(user, index) {

    // Recuperar storage existente ou criar uma nova
    const users = this.getValuesFromStorage()

    // Adicionar novo usuário criado
    users[index] = user

    // Salvar lista em storage
    localStorage.setItem('users', JSON.stringify(users))
  }

  /**
   * Remover usuário excluído do armazenamento local.
   * 
   * @param {Number} index Índice da linha do usuário sendo excluído.
   */
  delete(index) {

    // Recuperar storage existente ou criar uma nova
    const users = this.getValuesFromStorage()

    // Adicionar novo usuário criado
    users.splice(index, 1)

    // Salvar lista em storage
    localStorage.setItem('users', JSON.stringify(users))
  }
}
