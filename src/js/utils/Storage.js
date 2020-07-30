
module.exports = class Storage {

  constructor(storageName, storageType) {
    this.name = storageName
    this._storage = storageType
    if (this.exists()) {
      this.set(this.selectAll())
    } else {
      this.set([])
    }
  }

  exists() {
    return !!this._storage[this._name]
  }

  set(content) {
    this._storage.setItem(this._name, JSON.stringify(Array.from(content)))
  }

  selectAll() {
    return Array.from(JSON.parse(this._storage.getItem(this._name)))
  }

  select(index) {
    return this.selectAll()[index]
  }

  indexOf(lookUpId, lookUpField = null) {
    // eslint-disable-next-line no-magic-numbers
    let i = -1
    this.selectAll().some((obj, index) => {
      const field = lookUpField || index
      if (obj[field] === lookUpId) {
        i = index
        return true
      }
      return false
    })
    return i
  }

  insert(content) {
    this.set(this.selectAll().concat(Array.of(content)))
  }

  update(index, content) {
    const records = this.selectAll()
    records[index] = content
    this.set(records)
  }

  delete(index) {
    const records = this.selectAll()
    records.splice(index, 1)
    this.set(records)
  }

  clear() {
    this._storage.removeItem(this.name)
  }

  get count() {
    return this.selectAll().length
  }

  set name(value) {
    if (this._name === undefined) {
      this._name = value
    } else {
      throw new TypeError('Cannot reset the name of an instanced Storage object')
    }
  }

  get name() {
    return this._name
  }
}
