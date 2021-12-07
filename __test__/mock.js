import * as jsonData from './data.json'

// Class used to mimick the localstorage in browsers
export class LocalStorageMock {
  getItem (key) {
    return this[key]
  }

  setItem (key, value) {
    this[key] = value
  }

  removeItem (key) {
    delete this[key]
  }

  clear () {
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        delete this[key]
      }
    }
  }
}

export class windowMock {
  constructor (url) {
    this.location = { href: url }
  }
}

export function fetchMock(url) {
    let dataArr = []
    for (let index = 0; index < 100; index++) {
        const newJson = JSON.parse(JSON.stringify(jsonData))
        newJson.id = index
        dataArr.push(newJson)
    }

    url = url.toString()
    const startIndex = url.indexOf('&number=') + 8
    const nextOptionIndex = url.indexOf('&', startIndex + 1)
    let endIndex = nextOptionIndex
    if (nextOptionIndex < 0) { endIndex = url.length }
    let number = parseInt(url.substring(startIndex, endIndex))
    number = (number > 100) ? 100 : number
    const res = { results: dataArr.slice(0, number) }
    return Promise.resolve({
      json: () => Promise.resolve(res)
    })
  }
