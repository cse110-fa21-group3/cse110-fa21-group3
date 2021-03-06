import * as LSHandler from '../source/scripts/API/localStorageHandler'
import * as jsonData from './data.json'
import './setup'

/// ///// Testing Functions For Javascript Files ////////

// Done
test('setLocalStorageItem Test', () => {
  global.localStorage.clear()
  const id = 'testID'
  const obj = {
    key: 'value'
  }
  LSHandler.setLocalStorageItem(id, obj)
  const result = global.localStorage.getItem(id)
  expect(result).toMatch(JSON.stringify(obj))
})

// Done
test('updateUserData Test', () => {
  global.localStorage.clear()
  const key = 'testKey'
  const value = ['1', '2']
  LSHandler.updateUserData(key, value)
  const result = JSON.parse(global.localStorage.getItem('userData'))[key]
  expect(result).toContain('1')
  expect(result).toContain('2')
})

// Done
test('setIntolerances Test', () => {
  global.localStorage.clear()
  const intolerances = 'dairy, snake, bamboo, milkshake, peanut'
  LSHandler.setIntolerances(intolerances)
  const result = JSON.parse(global.localStorage.getItem('userData')).intolerances
  expect(result).toContain('dairy')
  expect(result).toContain('peanut')
})

// Done
test('setIntolerances Empty Test', () => {
  global.localStorage.clear()
  const intolerances = ''
  LSHandler.setIntolerances(intolerances)
  const result = JSON.parse(global.localStorage.getItem('userData')).intolerances
  expect(result.length).toBe(0)
})

// Done
test('setMaxTime Test', () => {
  global.localStorage.clear()
  const maxTime = 123
  LSHandler.setMaxTime(maxTime)
  const result = JSON.parse(global.localStorage.getItem('userData')).maxTime
  expect(result).toBe(maxTime)
})

// Done
test('setMaxTime Empty Test', () => {
  global.localStorage.clear()
  LSHandler.setMaxTime('')
  const result = JSON.parse(global.localStorage.getItem('userData')).maxTime
  expect(result).toBe(LSHandler.DEFAULT_MAX_TIME)
})

// Done
test('removeRecipe test', () => {
  global.localStorage.clear()
  const key = 'testKey'
  const value = 'testValue'
  global.localStorage.setItem(key, value)
  LSHandler.removeRecipe(key)
  expect(global.localStorage.getItem(key)).toBe(undefined)
})

// Done
test('getDeletedRecipes Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {
    deletedRecipes: ['1111', '2222']
  }
  global.localStorage.setItem(key, JSON.stringify(userData))
  const result = LSHandler.getDeletedRecipes()
  expect(result).toContain('1111')
  expect(result).toContain('2222')
})

// Done
test('getFavoriteRecipes Test', () => {
  global.localStorage.clear()
  global.localStorage.setItem('userData', JSON.stringify({
    favorites: ['3', '4', '5']
  }))
  const result = LSHandler.getFavoriteRecipes()
  expect(result).toContain('3')
  expect(result).toContain('4')
  expect(result).toContain('5')
})

// Done
test('getDeletedRecipes userData Empty Test', () => {
  global.localStorage.clear()
  const result = LSHandler.getDeletedRecipes()
  expect(result.length).toBe(0)
})

// Done
test('getDeletedRecipes Array Empty Test', () => {
  global.localStorage.clear()
  const key = 'userData'
  const userData = {}
  global.localStorage.setItem(key, JSON.stringify(userData))
  const result = LSHandler.getDeletedRecipes()
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
  LSHandler.addFavoriteRecipe(id)
  LSHandler.addFavoriteRecipe(id2)
  const result = JSON.parse(global.localStorage.getItem('userData')).favorites
  expect(result).toContain(id)
  expect(result).toContain(id2)
})

test('addFavoriteRecipe Empty Test', () => {
  global.localStorage.clear()
  const id = '1111'
  LSHandler.addFavoriteRecipe(id)
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
  global.localStorage.setItem(id, JSON.stringify(jsonData))
  LSHandler.removeFavoriteRecipe(id)
  LSHandler.removeFavoriteRecipe(id2)
  const result = JSON.parse(global.localStorage.getItem('userData')).favorites
  expect(result).not.toContain(id)
  expect(result).not.toContain(id2)
})

// Done
test('getLocalStorageRecipes Test', () => {
  global.localStorage.clear()
  // case 1: localStorage is empty
  const emptyTest = (!LSHandler.getLocalStorageRecipes().length)

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
  const returnedRecipes = LSHandler.getLocalStorageRecipes()
  for (const item of returnedRecipes) {
    if (!global.localStorage.getItem(item.id)) {
      filledTest = false
      break
    }
  }

  expect(emptyTest).toBe(true)
  expect(filledTest).toBe(true)
})

// Done
test('removeDeletedRecipes Test', () => {
  global.localStorage.clear()
  const id1 = 'testId1'
  const id2 = 'testId2'
  const userData = {
    deletedRecipes: [id1, id2]
  }
  global.localStorage.setItem(id1, JSON.stringify(jsonData))
  global.localStorage.setItem(id2, JSON.stringify(jsonData))
  global.localStorage.setItem('userData', JSON.stringify(userData))

  LSHandler.removeDeletedRecipes()
  expect(Object.keys(global.localStorage).length - 1).toBe(0)
})

// Done
test('searchLocalRecipes Test', async () => {
  global.localStorage.clear()
  const queryTitle = 'chicken, salad'
  const queryIngre = 'lettuce'
  const id1 = 'testId1'
  const id2 = 'testId2'
  const value1 = {
    ingredientSearch: {
      salad: 1,
      chicken: 1
    }
  }
  const value2 = {
    ingredientSearch: {
      chicken: 1,
      lettuce: 1
    }
  }
  global.localStorage.setItem(id1, JSON.stringify(value1))
  global.localStorage.setItem(id2, JSON.stringify(value2))
  LSHandler.searchLocalRecipes(queryTitle).then(recipeTitleResults => {
    expect(recipeTitleResults).toContainEqual(value1)
    expect(recipeTitleResults).toContainEqual(value2)
  })
  LSHandler.searchLocalRecipes(queryIngre).then(recipeIngreResults => {
    expect(recipeIngreResults).toContainEqual(value2)
  })
})

// Done
test('searchLocalRecipes Test2', async () => {
  global.localStorage.clear()
  LSHandler.searchLocalRecipes('test').then(recipeIngreResults => {
    expect(recipeIngreResults.length).toBe(0)
  })
})

// Done
test('getRecipesCount Test', () => {
  global.localStorage.clear()
  global.localStorage.setItem('123', JSON.stringify(jsonData))
  global.localStorage.setItem('345', JSON.stringify(jsonData))
  global.localStorage.setItem('userData', JSON.stringify({
    favorites: ['345']
  }))
  global.localStorage.setItem('latestSearch', JSON.stringify({}))
  expect(LSHandler.getRecipesCount()).toBe(2)
})

// Done
test('getRandom Test', async () => {
  global.localStorage.clear()
  for (let i = 0; i < 10; i++) {
    global.localStorage.setItem(`${i}`, JSON.stringify(jsonData))
  }
  let resultArr = LSHandler.getNRandomRecipes(2)
  expect(resultArr.length).toBe(2)
  resultArr = LSHandler.getNRandomRecipes(100)
  expect(resultArr.length).toBe(10)
})
