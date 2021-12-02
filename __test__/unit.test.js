// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax, 
// so now `import` and/or `export` statements work on both browser and unit test
  import * as functions from '../source/scripts/API/utilityFunctions'

// Class used to mimick the localstorage in browsers
class localStorageMock {
  constructor() {
    this.data = {}
  }

  getItem(key) {
    return this.data[key]
  }

  setItem(key, value) {
    this.data[key] = String(value)
  }

  removeItem(key) {
    delete this.data[key]
  }

  clear() {
    this.data = {}
  }
}

// storing unmocked local storage before all test.
const unmockedlocalStorage = global.localStorage

// set local storage in global to a mock version
beforeAll(() => {
  global.localStorage = new localStorageMock
})

// clean up mocked components in global
afterAll(() => {
  global.localStorage = unmockedlocalStorage
})

test('setLocalStorageItem Test', () => {
  let key = 'testID'
  let value = 'testValue'
  functions.setLocalStorageItem(key, 'testValue')
  let result = localStorage.getItem(key)
  expect(result).toMatch(/testValue/)
})

test('setIntolerances Test', () => {
  
})

test('loadUserData Test', () => {

})

test('getFavoriteRecipes Test', () => {

})

test('getDeletedRecipes Test', () => {

})

test('addFavoriteRecipe Test', () => {

})

test('getFavoriteRecipe Test', () => {

})

test('removeFavoriteRecipe Test', () => {

})

test('removeRecipe test', () => {

})

test('updateUserData Test', () => {

})

test('populateRecipes Test', () => {

})

test('removeDeletedRecipes Test', () => {

})

test('searchLocalRecipes Test', () => {

})

test('fetchRecipes Test', () => {

})

test('fetchSummaries Test', () => {

})

test('createRecipeObject Test', () => {

})

test('getLocalStorageRecipes Test', () => {

})
