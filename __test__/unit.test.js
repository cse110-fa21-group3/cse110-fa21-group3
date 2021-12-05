// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax, 
// so now `import` and/or `export` statements work on both browser and unit test
  import * as utilityFunctions from '../source/scripts/API/utilityFunctions'
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

class windowMock {
  constructor(url) {
    this.location = {href: url}
  }
}


// global constants
const unmockedlocalStorage = global.localStorage
const unmockedFetch = global.fetch
const unmockedWindow = global.window


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

//////// Testing Functions For Javascript Files ////////

// Done
test('setLocalStorageItem Test', () => {
  localStorage.clear()
  let id = 'testID'
  let obj = {
    key : 'value'
  }
  utilityFunctions.setLocalStorageItem(id, obj)
  let result = localStorage.getItem(id)
  expect(result).toMatch(JSON.stringify(obj))
})

// Done
test('updateUserData Test', () => {
  localStorage.clear()
  let key = 'testKey'
  let value = ['1', '2', '3']
  utilityFunctions.updateUserData(key, value)
  let result = JSON.parse(localStorage.getItem('userData'))[key]
  expect(result).toContain('1')
  expect(result).toContain('2')
  expect(result).toContain('3')
})

// Done
test('setIntolerances Test', () => {
  localStorage.clear()
  let intolerances = 'dairy, snake, bamboo, milkshake, peanut'
  utilityFunctions.setIntolerances(intolerances)
  let result = JSON.parse(localStorage.getItem('userData'))['intolerances']
  expect(result).toContain('dairy');
  expect(result).toContain('peanut');
})

// Done
test('setIntolerances Empty Test', () => {
  localStorage.clear()
  let intolerances = ''
  utilityFunctions.setIntolerances(intolerances)
  let result = JSON.parse(localStorage.getItem('userData'))['intolerances']
  expect(result.length).toBe(0)
})

// Done
test('setMaxTime Test', () => {
  localStorage.clear()
  let maxTime = 123
  utilityFunctions.setMaxTime(123)
  let result = JSON.parse(localStorage.getItem('userData'))['maxTime']
  expect(result).toBe(123)
})

// Done
test('setMaxTime Empty Test', () => {
  localStorage.clear()
  utilityFunctions.setMaxTime('')
  let result = JSON.parse(localStorage.getItem('userData'))['maxTime']
  expect(result).toBe(utilityFunctions.DEFAULT_MAX_TIME)
})

// Done
test('removeRecipe test', () => {
  localStorage.clear();
  let key = 'testKey';
  let value = 'testValue';
  localStorage.setItem(key, value);
  utilityFunctions.removeRecipe(key);
  expect(localStorage.getItem(key)).toBeUndefined;
})


// Done
test('getDeletedRecipes Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'deletedRecipes': ['1111', '2222']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let result = utilityFunctions.getDeletedRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('getFavoriteRecipes Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {
    'favorites': ['1111', '2222']
  }
  localStorage.setItem(key, JSON.stringify(userData))
  let result = utilityFunctions.getFavoriteRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('getDeletedRecipes userData Empty Test', () => {
  localStorage.clear()
  let result = utilityFunctions.getDeletedRecipes()
  expect(result.length).toBe(0)
})

// Done
test('getDeletedRecipes Array Empty Test', () => {
  localStorage.clear()
  let key = 'userData'
  let userData = {}
  localStorage.setItem(key, JSON.stringify(userData))
  let result = utilityFunctions.getDeletedRecipes()
  expect(result.length).toBe(0)
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
  let id2 = '1111'
  let value = {
    title : 'kale',
    ingredient : 'kale',
    favorite: false
  }
  localStorage.setItem(id, JSON.stringify(value))
  utilityFunctions.addFavoriteRecipe(id)
  utilityFunctions.addFavoriteRecipe(id2)
  let result = JSON.parse(localStorage.getItem('userData'))['favorites']
  expect(result).toContain(id)
  expect(result).toContain(id2)
})

test('addFavoriteRecipe Empty Test', () => {
  localStorage.clear()
  let id = '1111'
  utilityFunctions.addFavoriteRecipe(id)
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
  let id2 =  '1111'
  let value = {
    title : 'kale',
    ingredient : 'kale',
    favorite: true
  }
  localStorage.setItem(id, JSON.stringify(value))
  utilityFunctions.removeFavoriteRecipe(id)
  utilityFunctions.removeFavoriteRecipe(id2)
  let result = JSON.parse(localStorage.getItem('userData'))['favorites']
  expect(result).not.toContain(id);
  expect(result).not.toContain(id2);
})

// Done
test('getLocalStorageRecipes Test', () => {
  localStorage.clear();
  // case 1: localStorage is empty
  let emptyTest = (!utilityFunctions.getLocalStorageRecipes().length) ? true : false;

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
  let returnedRecipes = utilityFunctions.getLocalStorageRecipes();
  for (let item of returnedRecipes) {
    if (!localStorage.getItem(item.id)) {
      filledTest = false;
      break;
    }
  }
  
  expect(emptyTest).toBe(true);
  expect(filledTest).toBe(true);
})

test('getLocalStorageRecipes Empty Test', () => {
  localStorage.clear()
  let returnedRecipes = utilityFunctions.getLocalStorageRecipes();
  expect(returnedRecipes.length).toBe(0)
})

// Done
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

  utilityFunctions.removeDeletedRecipes()
  let recipeCount = Object.keys(localStorage).length - 1
  expect(recipeCount).toBe(0)
})

// Done
test('searchLocalRecipes Test', async () => {
  localStorage.clear()
  let queryTitle = 'chicken, salad'
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
  localStorage.clear()
  utilityFunctions.searchLocalRecipes('test').then(recipeIngreResults => {
    expect(recipeIngreResults.length).toBe(0)
  })
})

// Done
test('removeSummaryLinks Test', () => {
  let summary = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss. End.'
  let result = utilityFunctions.removeSummaryLinks(summary)
  expect(result).toMatch(/Start. End./)

  let summary2 = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss.'
  let result2 = utilityFunctions.removeSummaryLinks(summary2)
  expect(result2).toMatch(/Start./)
})

// Done
test('createRecipeObject Test', () => {
  localStorage.clear()
  utilityFunctions.createRecipeObject(jsonData).then(() => {
    expect(Object.keys(localStorage).length).toBe(1)
  })
})

/*
// Done
test('populateRecipes Test', async () => {
  localStorage.clear()
  return utilityFunctions.populateRecipes(199).then(() => {
    expect(Object.keys(localStorage).length).toBe(utilityFunctions.MINIMUM_RECIPE_REQUIRED)
  })
})

// Done
test('populateRecipes small number test', async () => {
  localStorage.clear()
  return utilityFunctions.populateRecipes(1).then(() => {
    expect(Object.keys(localStorage).length).toBe(utilityFunctions.MINIMUM_RECIPE_REQUIRED)
  })
})*/

// Done
test('fetchRecipes Test', async () => {
  localStorage.clear()
  let userData = {
    intolerances: ['dairy', 'snake', 'bamboo', 'milkshake', 'peanut']
  }
  localStorage.setItem('userData', JSON.stringify(userData))

  return utilityFunctions.fetchRecipes(5, 0).then(() => {
    // not counting userData
    expect(Object.keys(localStorage).length-1).toBe(5)
  })
})

// done
test('fetchRecipes Fail Test', async () => {
  localStorage.clear()
  let fetch = global.fetch
  global.fetch = () => Promise.resolve({
    json: () => Promise.resolve([])
  })
  return expect(utilityFunctions.fetchRecipes(5, 0).then(() => {
      global.fetch = fetch
    })).rejects.toBe('error')
})

// Done
test('loadUserData Test', () => {
  localStorage.clear()
  localStorage.setItem('userData', JSON.stringify({
    intolerances: ['dairy'],
    maxTime: 11
  }))
  utilityFunctions.loadUserData()
  expect(utilityFunctions.intolerances).toContain('dairy')
  expect(utilityFunctions.maxTime).toBe(11)
})

// Done
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
  global.window = unmockedWindow*/
})

// Done 
test('getRandom Test', async () => {
  localStorage.clear()
  for (let i = 0; i < 10; i++) {
    let value = {
      title : 'salad',
      ingredientSearch : 'lettuce'
    }
    localStorage.setItem(`${i}`, JSON.stringify(value))
  }
  let resultArr = utilityFunctions.getNRandomRecipes(2)
  expect(resultArr.length).toBe(2)
})

/*
test('webScrapper Test', async () => {
  localStorage.clear()
  let obj = utilityFunctions.webScrapper('https://www.allrecipes.com/recipe/23439/perfect-pumpkin-pie/')
  expect(typeof obj).toBe('object')
  return obj
})
*/