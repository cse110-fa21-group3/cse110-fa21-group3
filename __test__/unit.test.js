// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax, 
// so now `import` and/or `export` statements work on both browser and unit test
  import * as functions from '../source/scripts/API/utilityFunctions'
  import * as jsonData from './data.json'

// Class used to mimick the localstorage in browsers
class localStorageMock {
  constructor() {
  }

  getItem(key) {
    return this[key]
  }

  setItem(key, value) {
    this[key] = value;
  }

  removeItem(key) {
    delete this[key]
  }

  clear() {
    for (var key in this){
      if (this.hasOwnProperty(key)){
          delete this[key];
      }
    }
  }
}

// storing unmocked local storage before all test.
const unmockedlocalStorage = global.localStorage

const unmockedFetch = global.fetch

let dataArr = []

// set local storage in global to a mock version
beforeAll(() => {
  global.localStorage = new localStorageMock

  for (let index = 0; index < 100; index++) {    
    let newJson = JSON.parse(JSON.stringify(jsonData));
    newJson.id = index
    dataArr.push(newJson)
  }

  global.fetch = url => {
    url = url.toString()
    let startIndex = url.indexOf('&number=') + 8
    let nextOptionIndex = url.indexOf('&', startIndex+1)
    let endIndex = nextOptionIndex
    if (nextOptionIndex < 0) { endIndex = url.length }
    let number = parseInt(url.substring(startIndex, endIndex))
    number = (number > 100) ? 100 : number
    let res = {results: dataArr.slice(0, number)}
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

// done
test('setLocalStorageItem Test', () => {
  localStorage.clear()
  let id = 'testID'
  let obj = {
    key : 'value'
  }
  functions.setLocalStorageItem(id, obj)
  let result = localStorage.getItem(id)
  expect(result).toMatch(JSON.stringify(obj))
})

// martin
test('updateUserData Test', () => {
  localStorage.clear()
  let key = 'testKey'
  let value = ['1', '2', '3']
  functions.updateUserData(key, value)
  let result = JSON.parse(localStorage.getItem('userData'))[key]
  expect(result).toContain('1')
  expect(result).toContain('2')
  expect(result).toContain('3')
})

// martin
test('setIntolerances Test', () => {
  localStorage.clear()
  let intolerances = 'dairy, snake, bamboo, milkshake, peanut'
  functions.setIntolerances(intolerances)
  let result = JSON.parse(localStorage.getItem('userData'))['intolerances']
  expect(result).toContain('dairy');
  expect(result).toContain('peanut');
})

// martin
test('setMaxTime Test', () => {
  localStorage.clear()
  let maxTime = 123
  functions.setMaxTime(123)
  let result = JSON.parse(localStorage.getItem('userData'))['maxTime']
  expect(result).toBe(123)
})

// Done
test('removeRecipe test', () => {
  localStorage.clear();
  let key = 'testKey';
  let value = 'testValue';
  localStorage.setItem(key, value);
  functions.removeRecipe(key);
  expect(localStorage.getItem(key)).toBeUndefined;
})

// Done
test('getFavoriteRecipes Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'favorites': ['1111', '2222']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let result = functions.getFavoriteRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

//  Done
test('getDeletedRecipes Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'deletedRecipes': ['1111', '2222']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let result = functions.getDeletedRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('addFavoriteRecipe Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'favorites': ['1111', '22222']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let id =  '3333'
  let value = {
    title : 'kale',
    ingredient : 'kale',
    favorite: false
  }
  localStorage.setItem(id, JSON.stringify(value))
  functions.addFavoriteRecipe(id)
  let result = JSON.parse(localStorage.getItem('userData'))['favorites']
  expect(result).toContain(id)
})

// Done
test('removeFavoriteRecipe Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'favorites': ['3333','4444']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let id =  '3333'
  let value = {
    title : 'kale',
    ingredient : 'kale',
    favorite: true
  }
  localStorage.setItem(id, JSON.stringify(value))
  functions.removeFavoriteRecipe(id)
  let result = JSON.parse(localStorage.getItem('userData'))['favorites']
  expect(result).not.toContain(id);
})

// presley
test('getLocalStorageRecipes Test', () => {
  localStorage.clear();
  // case 1: localStorage is empty
  let emptyTest = (!functions.getLocalStorageRecipes().length) ? true : false;

  // case 2: localStorage filled including userData & latestSearch keys
  // populate localStorage as reference
  localStorage.setItem('latestSearch', JSON.stringify({'latest': 'search'}));
  localStorage.setItem('userData', JSON.stringify({'user': 'data'}));
  let id1 = 'testId1'
  let id2 = 'testId2'
  let value1 = {
    id : id1,
    title : 'chicken',
    ingredientSearch : 'chicken'
  }
  let value2 = {
    id :  id2,
    title : 'salad',
    ingredientSearch : 'lettuce'
  }
  localStorage.setItem(id1, JSON.stringify(value1))
  localStorage.setItem(id2, JSON.stringify(value2))
  
  let filledTest = true;
  let returnedRecipes = functions.getLocalStorageRecipes();
  for (let item of returnedRecipes) {
    if (!localStorage.getItem(item.id)) {
      filledTest = false;
      break;
    }
  }
  
  expect(emptyTest).toBe(true);
  expect(filledTest).toBe(true);
})

// martin
test('removeDeletedRecipes Test', () => {
  localStorage.clear()
  let id1 = 'testId1'
  let id2 = 'testId2'
  let recipe1 = {
    id : id1
  }
  let recipe2 = {
    id :  id2,
  }
  let userData = {
    'deletedRecipes': [id1, id2]
  }
  localStorage.setItem(id1, JSON.stringify(recipe1))
  localStorage.setItem(id2, JSON.stringify(recipe2))
  localStorage.setItem('userData', JSON.stringify(userData))

  functions.removeDeletedRecipes()
  let recipeCount = Object.keys(localStorage).length - 1
  expect(recipeCount).toBe(0)
})

// NATHAN
test('searchLocalRecipes Test', async () => {
  localStorage.clear()
  let queryTitle = 'chicken'
  let queryIngre = 'lettuce'
  let id1 = 'testId1'
  let id2 = 'testId2'
  let value1 = {
    title : 'chicken',
    ingredientSearch : 'chicken'
  }
  let value2 = {
    title : 'salad',
    ingredientSearch : 'lettuce'
  }
  localStorage.setItem(id1, JSON.stringify(value1))
  localStorage.setItem(id2, JSON.stringify(value2))
  functions.searchLocalRecipes(queryTitle).then(recipeTitleResults => {
    expect(recipeTitleResults).toContainEqual(value1)
  })
  functions.searchLocalRecipes(queryIngre).then(recipeIngreResults => {
    expect(recipeIngreResults).toContainEqual(value2)
  })
})

// martin
test('removeSummaryLinks Test', () => {
  let summary = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss. End.'
  let result = functions.removeSummaryLinks(summary)
  expect(result).toMatch(/Start. End./)

  let summary2 = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss.'
  let result2 = functions.removeSummaryLinks(summary2)
  expect(result2).toMatch(/Start./)
})

// leave it for now, we'll figure it out - nathan & martin
test('createRecipeObject Test', () => {
  localStorage.clear()
  functions.createRecipeObject(jsonData).then(() => {
    expect(Object.keys(localStorage).length).toBe(1)
  })
})

// leave it for now, we'll figure it out - nathan & martin

test('populateRecipes Test', async () => {
  localStorage.clear()
  return functions.populateRecipes(10).then(() => {
    console.log(Object.keys(localStorage).length)
    //expect(Object.keys(localStorage).length).toBe(101)
  })
})

// leave it for now, we'll figure it out - nathan & martin
test('fetchRecipes Test', async () => {
  localStorage.clear()

  return functions.fetchRecipes(10, 0).then(() => {
    expect(Object.keys(localStorage).length).toBe(10)
  })
})

// martin
test('loadUserData Test', () => {
  localStorage.clear()
  localStorage.setItem('userData', JSON.stringify({
    intolerances: ['dairy'],
    maxTime: 11
  }))
  functions.loadUserData()
  expect(functions.intolerances).toContain('dairy')
  expect(functions.maxTime).toBe(11)
})

// martin
test('getRecipesCount Test', () => {
  localStorage.clear()
  localStorage.setItem('123', JSON.stringify({
    id : '123'
  }))
  localStorage.setItem('345', JSON.stringify({
    id : '345'
  }))
  localStorage.setItem('userData', JSON.stringify({
    favorites : ['345']
  }))
  localStorage.setItem('latestSearch', JSON.stringify({
    query : '123'
  }))
  expect(functions.getRecipesCount()).toBe(2)
})