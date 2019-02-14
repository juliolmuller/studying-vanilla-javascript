
/**
 * Object with multiple useful methods.
 * @author Julio L. Muller
 * @version 0.4.0
 */
const Utils = {

  /**
   * Returns a formated date as string.
   * @param {Date} date Receives an instance of Date.
   * @param {string} template Receives the template string that is desired for output. Default format is 'yyyy-MM-dd'.
   */
  formatDate(date, template = 'yyyy-MM-dd') {
    if (template == 'yyyy-MM-dd') {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    } else if (template == 'dd/MM/yyyy') {
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    } else if (template == 'dd/MM/yyyy hh:mm') {
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
    }
  },

  /**
   * Evaluates if a string has only alphabetic characters (including spaces). Parameter is tested against regular expression /^([a-zA-ZÀ-ú ])+$/.
   * @param {string} string Receives the data to be validated.
   * @param {boolean} accentsAllowed Specifies if accented letters are allowed (default is True).
   */
  isName(string, accentsAllowed = true) {
    const accents = accentsAllowed ? 'À-ú' : ''
    const regex = new RegExp('^([a-zA-Z' + accents +' ])+$')
    return regex.test(string)
  },

  /**
   * Evaluates if a string has basic email address formats. Parameter is tested against regular expression /^(\[a-zA-Z0-9_.+-])+\@((\[a-zA-Z0-9-])+\.)+(\[a-zA-Z0-9]{2,4})+$/.
   * @param {string} string Receives the data to be validated.
   */
  isEmail(string) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(string)
  },

  /**
   * Converts reserved HTML characters, such as '<' and '>', into readable HTML codes.
   * @param {string} string Receives the string to be parsed.
   */
  escapeHTML(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return string.replace(/[&<>"']/g, m => map[m])
  },

  valPassword(string/*, { max = null, min = null, numbers = false, lower = false, upper = false, special = false }*/) {
    return true
  },

  /**
   * Evaluates if the string is a valid brazilian document ID CPF (XXX.XXX.XXX-XX).
   * @param {string} string Receives the data to be validated.
   */
  isCPF(string) {
    
    // Remove non numeric characters
    const regex = /[0-9]/
    let cpf = Array.from(string).filter(char => regex.test(char))
    
    // If it contains more than 11 digits, return FALSE
    if (cpf.length > 11) {
      return false
      
      // If it does not contain 11 digits, fill out with zeros on the left
    } else if (cpf.length < 11) {
      cpf = '0'.repeat(11 - cpf.length).split('').concat(cpf).map(d => parseInt(d))
    }
    
    // Calculate eligible verifying digits
    const calcVD = [null, null]
    for (let index in calcVD) {
      calcVD[index] = (Array.from(cpf).reverse()
        .map((value, pos) => (pos > index) ? value * pos : undefined)
        .filter(d => d != undefined)
        .reduce((total, next) => total + next) * 10) % 11
    }

    // Capture actual verifying digits
    const actualVD = cpf.splice(9, 2).reverse()

    // Compare arrays and return result
    const checks = [false, false]
    for (let index in checks) {
      checks[index] = (actualVD[index] == calcVD[index]) 
    }
    return (checks[0] === checks[1])
  }
}
