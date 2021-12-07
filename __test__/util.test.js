// Used Babel in package.jsonto transform ES6 syntax to commonjs syntax,
// so now `import` and/or `export` statements work on both browser and unit test
import * as util from '../source/scripts/API/utilityFunctions'
import * as Mock from './mock'
import * as jsonData from './data.json'
import regeneratorRuntime from 'regenerator-runtime'

// global constants
const unmockedlocalStorage = global.localStorage
const unmockedFetch = global.fetch

// set local storage in global to a mock version
beforeAll(() => {
  global.localStorage = new Mock.LocalStorageMock()

  global.fetch = Mock.fetchMock
})

// clean up mocked components in global
afterAll(() => {
  global.localStorage = unmockedlocalStorage
  global.fetch = unmockedFetch
})

// Done
test('removeSummaryLinks Test', () => {
  const summary = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss. End.'
  const result = util.removeSummaryLinks(summary)
  expect(result).toMatch(/Start. End./)

  const summary2 = 'Start. <a href="blah.combla.com .comh">blahblah</a> ss.'
  const result2 = util.removeSummaryLinks(summary2)
  expect(result2).toMatch(/Start./)
})

// Done
test('createRecipeObject Test', () => {
  global.localStorage.clear()
  util.createRecipeObject(jsonData).then(() => {
    expect(Object.keys(global.localStorage).length).toBe(1)
  })
})

// Done
test('populateRecipes Test', async () => {
  global.localStorage.clear()
  return util.populateRecipes().then(() => {
    expect(Object.keys(global.localStorage).length - 1).toBeGreaterThanOrEqual(util.NUMBER_OF_RECIPES_TO_DISPLAY)
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

// done
test('fetchRecipes Fail Test', async () => {
  global.localStorage.clear()
  const fetch = global.fetch
  global.fetch = () => Promise.resolve({
    json: () => Promise.resolve([])
  })
  return expect(util.fetchRecipes(5, 0).then(() => {
    global.fetch = fetch
  })).rejects.toEqual(TypeError("Cannot read property 'forEach' of undefined"))
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

// need jsdom to test IN PROGRESS
test('router Test', () => {
/*
  global.window = new windowMock('https://007.com')
  LSHandler.router.home()
  LSHandler.router.navigate('test')
  LSHandler.router.navigate('home')

  console.log(window.location.href)
  global.window = unmockedWindow */
})
