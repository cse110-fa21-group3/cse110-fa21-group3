// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax,
// so now `import` and/or `export` statements work on both browser and unit test
import * as util from '../source/scripts/API/utilityFunctions'
import { getRecipesByType } from '../source/scripts/API/localStorageHandler'
import * as jsonData from './data.json'
import 'regenerator-runtime'
import './setup'

// Done
test('removeSummaryLinks Test', () => {
  const summary = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss. End.'
  const result = util.removeSummaryLinks(summary)
  expect(result).toMatch(/Start. End./)

  const summary2 = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss.'
  const result2 = util.removeSummaryLinks(summary2)
  expect(result2).toMatch(/Start./)

  const summary3 = undefined
  const result3 = util.removeSummaryLinks(summary3)
  expect(result3).toBe('No Summary Found')
})

// Done
test('createRecipeObject Test', () => {
  global.localStorage.clear()
  util.createRecipeObject(jsonData).then(() => {
    expect(Object.keys(global.localStorage).length).toBe(1)
  })
})

// Done
test('createRecipeObject Empty Test', () => {
  expect(util.createRecipeObject(null)).rejects.toStrictEqual(Error('Undefined Recipe Found'))
})

// Done
test('populateRecipes Test', async () => {
  global.localStorage.clear()
  return util.populateRecipes().then(() => {
    expect(Object.keys(global.localStorage).length-1).toBe(util.DEFAULT_RECIPE_NUMBER)
    util.populateRecipes().then(() => {
      expect(Object.keys(global.localStorage).length-1).toBe(util.DEFAULT_RECIPE_NUMBER)
    })
  })
})

// Done
test('fetchRecipes Test', async () => {
  global.localStorage.clear()
  const userData = {
    intolerances: ['dairy', 'snake', 'bamboo', 'milkshake', 'peanut']
  }
  global.localStorage.setItem('userData', JSON.stringify(userData))

  return util.fetchRecipes(5, 0).then(() => {
    // not counting userData
    expect(Object.keys(global.localStorage).length - 1).toBe(5)
  })
})

// Done
test('loadUserData Test', () => {
  global.localStorage.clear()
  global.localStorage.setItem('userData', JSON.stringify({
    intolerances: ['dairy'],
    maxTime: 11
  }))
  util.loadUserData()
  expect(util.intolerances).toContain('dairy')
  expect(util.maxTime).toBe(11)
})

test('extractSteps Test', () => {
  global.localStorage.clear()
  const steps = [{ step: 'step 1' }, { step: 'step 2' }]
  const result = util.extractSteps(steps)
  expect(result).toContain('step 1')
  expect(result).toContain('step 2')
  const emptyResult = util.extractSteps(undefined)
  expect(emptyResult).toContain('No Steps')
})

test('extractNutrition Test', () => {
  global.localStorage.clear()
  const arr = []
  for (let i = 0; i < 9; i++) {
    arr.push({ title: 'Sugar', amount: '1', unit: 'g' })
  }
  const nutrition = { nutrients: arr }

  const result = util.extractNutrition(nutrition)
  expect(result).toContain('Sugar: 1 g')
})

test('extractNutrition null Test', () => {
  global.localStorage.clear()
  let nutrition

  const result = util.extractNutrition(nutrition)
  expect(result).toStrictEqual(util.DEFAULT_NUTRITIONS)
})

test('extractIngredients Test', () => {
  global.localStorage.clear()
  const title = 'chicken breast'
  const ingredients = [{ original: '1 oz chicken', name: 'chicken' }, { original: '1 oz oil', name: 'oil' }]
  const result = util.extractIngredients(ingredients, title)
  expect(result.ingredientSearch.chicken).toBe(1)
  expect(result.ingredientSearch.breast).toBe(1)
  expect(result.ingredientSearch.oil).toBe(1)
  const result2 = util.extractIngredients(undefined, title)
  expect(result2.ingredientSearch.chicken).toBe(1)
})

test('updateOffset Test', () => {
  global.localStorage.clear()
  util.updateOffset(50)
  expect(JSON.parse(global.localStorage.getItem('userData')).offset).toBe(util.DEFAULT_OFFSET + 50)
  util.updateOffset(100)
  expect(JSON.parse(global.localStorage.getItem('userData')).offset).toBe(util.DEFAULT_OFFSET + 150)
})

test('webScrapper Test', async () => {
  global.localStorage.clear()
  await util.webScrapper('https://007.com')
  expect(Object.keys(global.localStorage).length).toBe(1)
})

test('getRecipesByType Test', () => {
  global.localStorage.clear()
  let obj1 = {
    id : '123',
    dishTypes: ['side dish']
  }

  let obj2 = {
    id : '789',
    dishTypes: ['main dish']
  }

  let obj3 = {
    id : 'apple',
    dishTypes: ['main dish']
  }
  global.localStorage.setItem('123', JSON.stringify(obj1))
  global.localStorage.setItem('789', JSON.stringify(obj2))
  global.localStorage.setItem('apple', JSON.stringify(obj3))


  let result = getRecipesByType(2, 'side dish')
  expect(result.length).toBe(1)
  expect(result[0].id).toBe('123')
  result = getRecipesByType(1, 'main dish')
  expect(result.length).toBe(1)
})
