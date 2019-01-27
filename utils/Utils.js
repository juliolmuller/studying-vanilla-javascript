
class Utils {

  static formatDate(date, template = 'yyyy-MM-dd') {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
  }

  static isName(string) {
    const regex = /^([a-zA-ZÀ-ú ])+$/
    return regex.test(string)
  }

  static isEmail(string) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return regex.test(string)
  }

  static escapeHTML(string) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return string.replace(/[&<>"']/g, m => map[m])
  }

  static valPassword(string/*, { max = null, min = null, numbers = false, lower = false, upper = false, special = false }*/) {
    return true
  }
}
