
/**
 * Abstract class to properly handle browser stoage.
 * @author Julio L. Muller
 * @version 1.0.0
 */
/* abstract */ class Storage {

  /**
   * Instance an object to handle the browser storage.
   * @param {string} storageName Name of the browser storage to be managed.
   */
  constructor(storageName, storageType) {
    if (this.constructor === Storage) throw new TypeError('Impossible to instance object of Storage class')
    this.name = storageName
    this._storage = storageType
    this.exists() ? this.set(this.selectAll()) : this.set([])
  }

  /**
   * Informs if a storage with the constructor name already exists.
   */
  exists() {
    return this._storage[this._name] ? true : false
  }

  /**
   * Sets up the content of the storage, creating one if it does not exist yet.
   * @param {*} content Receives the data to be stored.
   */
  set(content) {
    this._storage.setItem(this._name, JSON.stringify(Array.from(content)))
  }

  /**
   * Returns all the records from the storage as an array.
   */
  selectAll() {
    return Array.from(JSON.parse(this._storage.getItem(this._name)))
  }

  /**
   * Returns one single record from the storage based on its array position.
   * @param {number} index Indicates the position of the record in the array.
   */
  select(index) {
    return this.selectAll()[index]
  }

  /**
   * Returns the index of a single record from the storage array.
   * @param {string | number} lookUpId Receives the searched value.
   * @param {string} lookUpField Receives an specific object property where the search should be made.
   */
  indexOf(lookUpId, lookUpField = null) {
    let i = -1
    this.selectAll().some((obj, index) => {
      const field = lookUpField || index
      if (obj[field] == lookUpId) {
        i = index
        return true
      }
    })
    return i
  }

  /**
   * Append a new record to the storage array
   * @param {User} content Receives the data to be appended.
   */
  insert(content) {
    this.set(this.selectAll().concat(Array.of(content)))
  }

  /**
   * Update an existing recod in the browser storage.
   * @param {Number} index Receives the index of the record to be updated in the storage array.
   * @param {User} content Receives the object or content to be replaceing the selected record.
   */
  update(index, content) {
    const records = this.selectAll()
    records[index] = content
    this.set(records)
  }

  /**
   * Delete record from storage array.
   * @param {Number} index Receives the index of the record to be deleted.
   */
  delete(index) {
    const records = this.selectAll()
    records.splice(index, 1)
    this.set(records)
  }

  /**
   * Deletes the reference to the instanced storage.
   */
  clear() {
    this._storage.removeItem(this.name)
  }

  /**
   * Returns the number of records in the storage array.
   */
  get count() {
    return this.selectAll().length
  }

  /**
   * Sets the value of 'name' attribute once.
   */
  set name(value) {
    if (this._name === undefined) {
      this._name = value
    } else {
      throw new TypeError('Cannot reset the name of an instanced Storage object')
    }
  }

  /**
   * Returns the browser storage name for the instanced object.
   */
  get name() {
    return this._name
  }
}

/**
 * Class to handle browser local stoage.
 */
class LocalStorage extends Storage {

  /**
   * Instance an object to handle the browser local storage.
   * @param {string} storageName Name of the local storage to be managed.
   */
  constructor(storageName) {
    super(storageName, localStorage)
  }
}

/**
 * Class to handle browser session stoage.
 */
class SessionStorage extends Storage {

  /**
   * Instance an object to handle the browser session storage.
   * @param {string} storageName Name of the session storage to be managed.
   */
  constructor(storageName) {
    super(storageName, sessionStorage)
  }
}