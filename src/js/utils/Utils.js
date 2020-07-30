/* eslint-disable no-magic-numbers */

module.exports = {

  formatDate(date, template = 'yyyy-MM-dd') {
    if (template === 'yyyy-MM-dd') {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    } if (template === 'dd/MM/yyyy') {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    } if (template === 'dd/MM/yyyy hh:mm') {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }
    return null
  },

  isName(string, accentsAllowed = true) {
    const accents = accentsAllowed ? 'À-ú' : ''
    const regex = new RegExp(`^([a-zA-Z${accents} ])+$`)
    return regex.test(string)
  },

  isEmail(string) {
    const regex = /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(string)
  },

  escapeHTML(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return string.replace(/[&<>"']/g, (m) => map[m])
  },

  isCPF(string) {

    const regex = /[0-9]/
    let cpf = [...string].filter((char) => regex.test(char))

    if (cpf.length > 11) {
      return false
    } if (cpf.length < 11) {
      cpf = '0'.repeat(11 - cpf.length).split('').concat(cpf).map((d) => parseInt(d, 10))
    }

    const calcVD = [null, null]
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const index in calcVD) {
      calcVD[index] = (Array.from(cpf).reverse()
        .map((value, pos) => ((pos > index) ? value * pos : undefined))
        .filter((d) => d !== undefined)
        .reduce((total, next) => total + next) * 10) % 11
    }

    // Capture actual verifying digits
    const actualVD = cpf.splice(9, 2).reverse()

    // Compare arrays and return result
    const checks = [false, false]
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const index in checks) {
      checks[index] = (actualVD[index] === calcVD[index])
    }
    return (checks[0] === checks[1])
  },
}
