// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax,
// so now `import` and/or `export` statements work on both browser and unit test
import * as utilityFunctions from '../source/scripts/API/utilityFunctions'
import * as jsonData from './data.json'
import regeneratorRuntime from 'regenerator-runtime'

// Class used to mimick the localstorage in browsers
class LocalStorageMock {
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

class windowMock {
  constructor (url) {
    this.location = { href: url }
  }
}

// global constants
const unmockedlocalStorage = global.localStorage
const unmockedFetch = global.fetch

const dataArr = []

// set local storage in global to a mock version
beforeAll(() => {
  global.localStorage = new LocalStorageMock()

  for (let index = 0; index < 100; index++) {
    const newJson = JSON.parse(JSON.stringify(jsonData))
    newJson.id = index
    dataArr.push(newJson)
  }

  global.fetch = url => {
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
})

// clean up mocked components in global
afterAll(() => {
  global.localStorage = unmockedlocalStorage
  global.fetch = unmockedFetch
})

/// ///// Testing Functions For Javascript Files ////////

// Done
test('setLocalStorageItem Test', () => {
  global.localStorage.clear()
  const id = 'testID'
  const obj = {
    key: 'value'
  }
  utilityFunctions.setLocalStorageItem(id, obj)
  const result = global.localStorage.getItem(id)
  expect(result).toMatch(JSON.stringify(obj))
})

// Done
test('updateUserData Test', () => {
  global.localStorage.clear()
  const key = 'testKey'
  const value = ['1', '2', '3']
  utilityFunctions.updateUserData(key, value)
  const result = JSON.parse(global.localStorage.getItem('userData'))[key]
  expect(result).toContain('1')
  expect(result).toContain('2')
  expect(result).toContain('3')
})

// Done
test('setIntolerances Test', () => {
  global.localStorage.clear()
  const intolerances = 'dairy, snake, bamboo, milkshake, peanut'
  utilityFunctions.setIntolerances(intolerances)
  const result = JSON.parse(global.localStorage.getItem('userData')).intolerances
  expect(result).toContain('dairy')
  expect(result).toContain('peanut')
})

// Done
test('setIntolerances Empty Test', () => {
  global.localStorage.clear()
  const intolerances = ''
  utilityFunctions.setIntolerances(intolerances)
  const result = JSON.parse(global.localStorage.getItem('userData')).intolerances
  expect(result.length).toBe(0)
})

// Done
test('setMaxTime Test', () => {
  global.localStorage.clear()
  const maxTime = 123
  utilityFunctions.setMaxTime(maxTime)
  const result = JSON.parse(global.localStorage.getItem('userData')).maxTime
  expect(result).toBe(maxTime)
})

// Done
test('setMaxTime Empty Test', () => {
  global.localStorage.clear()
  utilityFunctions.setMaxTime('')
  const result = JSON.parse(global.localStorage.getItem('userData')).maxTime
  expect(result).toBe(utilityFunctions.DEFAULT_MAX_TIME)
})

// Done
test('removeRecipe test', () => {
  global.localStorage.clear()
  const key = 'testKey'
  const value = 'testValue'
  global.localStorage.setItem(key, value)
  utilityFunctions.removeRecipe(key)
  expect(global.localStorage.getItem(key)).toBeUndefined
})

// Done
test('getDeletedRecipes Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {
    deletedRecipes: ['1111', '2222']
  }
  global.localStorage.setItem(key, JSON.stringify(userData))
  const result = utilityFunctions.getDeletedRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('getFavoriteRecipes Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {
    favorites: ['1111', '2222']
  }
  global.localStorage.setItem(key, JSON.stringify(userData))
  const result = utilityFunctions.getFavoriteRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('getDeletedRecipes userData Empty Test', () => {
  global.localStorage.clear()
  const result = utilityFunctions.getDeletedRecipes()
  expect(result.length).toBe(0)
})

// Done
test('getDeletedRecipes Array Empty Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {}
  global.localStorage.setItem(key, JSON.stringify(userData))
  const result = utilityFunctions.getDeletedRecipes()
  expect(result.length).toBe(0)
})

// Done
test('addFavoriteRecipe Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {
    favorites: ['1111', '22222']
  }
  global.localStorage.setItem(key, JSON.stringify(userData))
  const id = '3333'
  const id2 = '1111'
  const value = {
    title: 'kale',
    ingredient: 'kale',
    favorite: false
  }
  global.localStorage.setItem(id, JSON.stringify(value))
  utilityFunctions.addFavoriteRecipe(id)
  utilityFunctions.addFavoriteRecipe(id2)
  const result = JSON.parse(global.localStorage.getItem('userData')).favorites
  expect(result).toContain(id)
  expect(result).toContain(id2)
})

test('addFavoriteRecipe Empty Test', () => {
  global.localStorage.clear()
  const id = '1111'
  utilityFunctions.addFavoriteRecipe(id)
  const result = JSON.parse(global.localStorage.getItem('userData')).favorites
  expect(result).toContain(id)
})

// Done
test('removeFavoriteRecipe Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {
    favorites: ['3333', '4444']
  }
  global.localStorage.setItem(key, JSON.stringify(userData))
  const id = '3333'
  const id2 = '1111'
  const value = {
    title: 'kale',
    ingredient: 'kale',
    favorite: true
  }
  global.localStorage.setItem(id, JSON.stringify(value))
  utilityFunctions.removeFavoriteRecipe(id)
  utilityFunctions.removeFavoriteRecipe(id2)
  const result = JSON.parse(global.localStorage.getItem('userData')).favorites
  expect(result).not.toContain(id)
  expect(result).not.toContain(id2)
})

// Done
test('getLocalStorageRecipes Test', () => {
  global.localStorage.clear()
  // case 1: localStorage is empty
  const emptyTest = (!utilityFunctions.getLocalStorageRecipes().length)

  // case 2: localStorage filled including userData & latestSearch keys
  // populate localStorage as reference
  global.localStorage.setItem('latestSearch', JSON.stringify({ latest: 'search' }))
  global.localStorage.setItem('userData', JSON.stringify({ user: 'data' }))
  const id1 = 'testId1'
  const id2 = 'testId2'
  const value1 = {
    id: id1,
    title: 'chicken',
    ingredientSearch: 'chicken'
  }
  const value2 = {
    id: id2,
    title: 'salad',
    ingredientSearch: 'lettuce'
  }
  global.localStorage.setItem(id1, JSON.stringify(value1))
  global.localStorage.setItem(id2, JSON.stringify(value2))

  let filledTest = true
  const returnedRecipes = utilityFunctions.getLocalStorageRecipes()
  for (const item of returnedRecipes) {
    if (!global.localStorage.getItem(item.id)) {
      filledTest = false
      break
    }
  }

  expect(emptyTest).toBe(true)
  expect(filledTest).toBe(true)
})

test('getLocalStorageRecipes Empty Test', () => {
  global.localStorage.clear()
  const returnedRecipes = utilityFunctions.getLocalStorageRecipes()
  expect(returnedRecipes.length).toBe(0)
})

// Done
test('removeDeletedRecipes Test', () => {
  global.localStorage.clear()
  const id1 = 'testId1'
  const id2 = 'testId2'
  const recipe1 = {
    id: id1
  }
  const recipe2 = {
    id: id2
  }
  const userData = {
    deletedRecipes: [id1, id2]
  }
  global.localStorage.setItem(id1, JSON.stringify(recipe1))
  global.localStorage.setItem(id2, JSON.stringify(recipe2))
  global.localStorage.setItem('userData', JSON.stringify(userData))

  utilityFunctions.removeDeletedRecipes()
  const recipeCount = Object.keys(global.localStorage).length - 1
  expect(recipeCount).toBe(0)
})

// Done
test('searchLocalRecipes Test', async () => {
  global.localStorage.clear()
  const queryTitle = 'chicken, salad'
  const queryIngre = 'lettuce'
  const id1 = 'testId1'
  const id2 = 'testId2'
  const value1 = {
    title: 'chicken',
    ingredientSearch: 'chicken'
  }
  const value2 = {
    title: 'salad',
    ingredientSearch: 'lettuce'
  }
  global.localStorage.setItem(id1, JSON.stringify(value1))
  global.localStorage.setItem(id2, JSON.stringify(value2))
  utilityFunctions.searchLocalRecipes(queryTitle).then(recipeTitleResults => {
    expect(recipeTitleResults).toContainEqual(value1)
    expect(recipeTitleResults).toContainEqual(value2)
  })
  utilityFunctions.searchLocalRecipes(queryIngre).then(recipeIngreResults => {
    expect(recipeIngreResults).toContainEqual(value2)
  })
})

// Done
test('searchLocalRecipes Test2', async () => {
  global.localStorage.clear()
  utilityFunctions.searchLocalRecipes('test').then(recipeIngreResults => {
    expect(recipeIngreResults.length).toBe(0)
  })
})

// Done
test('removeSummaryLinks Test', () => {
  const summary = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss. End.'
  const result = utilityFunctions.removeSummaryLinks(summary)
  expect(result).toMatch(/Start. End./)

  const summary2 = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss.'
  const result2 = utilityFunctions.removeSummaryLinks(summary2)
  expect(result2).toMatch(/Start./)
})

// Done
test('createRecipeObject Test', () => {
  global.localStorage.clear()
  utilityFunctions.createRecipeObject(jsonData).then(() => {
    expect(Object.keys(global.localStorage).length).toBe(1)
  })
})

// Done
test('populateRecipes Test', async () => {
  global.localStorage.clear()
  return utilityFunctions.populateRecipes().then(() => {
    expect(Object.keys(global.localStorage).length - 1).toBeGreaterThanOrEqual(utilityFunctions.NUMBER_OF_RECIPES_TO_DISPLAY)
  })
})

// Done
test('fetchRecipes Test', async () => {
  global.localStorage.clear()
  const userData = {
    intolerances: ['dairy', 'snake', 'bamboo', 'milkshake', 'peanut']
  }
  global.localStorage.setItem('userData', JSON.stringify(userData))

  return utilityFunctions.fetchRecipes(5, 0).then(() => {
    // not counting userData
    expect(Object.keys(global.localStorage).length - 1).toBe(5)
  })
})

// done
test('fetchRecipes Fail Test', async () => {
  global.localStorage.clear()
  const fetch = global.fetch
  global.fetch = () => Promise.resolve({
    json: () => Promise.resolve([])
  })
  return expect(utilityFunctions.fetchRecipes(5, 0).then(() => {
    global.fetch = fetch
  })).rejects
})

// Done
test('loadUserData Test', () => {
  global.localStorage.clear()
  global.localStorage.setItem('userData', JSON.stringify({
    intolerances: ['dairy'],
    maxTime: 11
  }))
  utilityFunctions.loadUserData()
  expect(utilityFunctions.intolerances).toContain('dairy')
  expect(utilityFunctions.maxTime).toBe(11)
})

// Done
test('getRecipesCount Test', () => {
  global.localStorage.clear()
  global.localStorage.setItem('123', JSON.stringify({
    id: '123'
  }))
  global.localStorage.setItem('345', JSON.stringify({
    id: '345'
  }))
  global.localStorage.setItem('userData', JSON.stringify({
    favorites: ['345']
  }))
  global.localStorage.setItem('latestSearch', JSON.stringify({
    query: '123'
  }))
  expect(utilityFunctions.getRecipesCount()).toBe(2)
})

// need jsdom to test IN PROGRESS
test('router Test', () => {
/*
  global.window = new windowMock('https://007.com')
  utilityFunctions.router.home()
  utilityFunctions.router.navigate('test')
  utilityFunctions.router.navigate('home')

  console.log(window.location.href)
  global.window = unmockedWindow */
})

// Done
test('getRandom Test', async () => {
  global.localStorage.clear()
  for (let i = 0; i < 10; i++) {
    const value = {
      title: 'salad',
      ingredientSearch: 'lettuce'
    }
    global.localStorage.setItem(`${i}`, JSON.stringify(value))
  }
  const resultArr = utilityFunctions.getNRandomRecipes(2)
  expect(resultArr.length).toBe(2)
})

/**
test('webScrapper Test', async () => {
  global.localStorage.clear()
  let obj = utilityFunctions.webScrapper('https://www.allrecipes.com/recipe/23439/perfect-pumpkin-pie/')
  expect(typeof obj).toBe('object')
  return obj
})
*/
