// API Key and endpoint
const API_KEY = '6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f'
const API_ENDPOINT = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'

// These are typically the options we need to perform a request
const options = {
  credentials: 'omit',
  method: 'GET',
  mode: 'cors',
  headers: {
    'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'x-rapidapi-key': '6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f'
  }
}

export const DEFAULT_RECIPE_NUMBER = 10
export const DEFAULT_MAX_TIME = 60
export const NUMBER_OF_RECIPES_TO_DISPLAY = 10

// list of intolerances filter offered by the Spoonacular API
const allowedIntolerances = [
  'dairy',
  'egg',
  'gluten',
  'grain',
  'peanut',
  'seafood',
  'sesame',
  'shellfish',
  'soy',
  'sulfite',
  'tree nut',
  'wheat'
]

const DEFAULT_NUTRITIONS = [
  'Calories: unknown',
  'Fat : unknown',
  'Saturated Fat: unknown',
  'Carbohydrates: unknown',
  'Net Carbohydrates: unknown',
  'Sugar: unknown',
  'Cholestroel: unknown',
  'Sodium: unknown',
  'Protein: unknown'
]

// list of user Intolerances
export let intolerances = []
// max for recipes prep time
export let maxTime = DEFAULT_MAX_TIME
// user data variables
const USER_DATA = 'userData'

class RecipeObject {
  constructor (id, title, foodImage, readyInMinutes, ingredientSearch, ingredients, steps, nutrition, favorite, summary, size) {
    this.id = id || '0'
    this.title = title || 'Website Food'
    this.image = foodImage || './image/team3-logo.jpg'
    this.readyInMinutes = readyInMinutes || 'unkown'
    this.ingredientSearch = ingredientSearch
    this.ingredients = ingredients
    this.steps = steps
    this.nutrition = nutrition
    this.favorite = favorite
    this.summary = summary
    this.servingSize = size || 'unkown'
  }
}

/**
 * This function updates the intolerances of the user which is used when
 * fetching recipes from the API
 * @param {String} inputIntol - A string of the intolerances.
 */
export function setIntolerances (inputIntol) {
  if (inputIntol === '') {
    updateUserData('intolerances', [])
    return
  }

  // Expected format: in1, in2, in3, ...
  const inputArray = inputIntol.toLowerCase().replace(/\s/g, '').split(',')
  const intols = []
  for (const intol of inputArray) {
    // if the entries matches any of the item in the allowedIntolerances
    // array, then add it to userData.
    if (allowedIntolerances.includes(intol)) {
      intols.push(intol)
    }
  }

  // Update the userData in localStorage
  updateUserData('intolerances', intols)
}

/**
 * This function updates the maxTime of the recipes which is used when fetching
 * from the API
 * @param {String} time - A string containing the maxTime.
 */
export function setMaxTime (time) {
  if (time === '') {
    updateUserData('maxTime', DEFAULT_MAX_TIME)
    return
  }
  maxTime = parseInt(time)

  // Update the userData in localStorage
  updateUserData('maxTime', maxTime)
}

/**
 * This function loads the userData stored in localStorage and
 * sets the `intolerances` variable and the `maxTime` variable
 */
export function loadUserData () {
  let data = localStorage.getItem(USER_DATA)
  if (data) {
    data = JSON.parse(data)
  } else {
    intolerances = []
    maxTime = DEFAULT_MAX_TIME
    return
  }

  intolerances = data.intolerances ? data.intolerances : []
  maxTime = data.maxTime ? data.maxTime : DEFAULT_MAX_TIME
}

/**
 * Method to get the current favorited recipes
 * @returns the favorited recipes
 */
export function getFavoriteRecipes () {
  const userData = localStorage.getItem(USER_DATA)
  let favoriteRecipes
  if (userData) {
    favoriteRecipes = JSON.parse(userData).favorites
  }

  if (!favoriteRecipes) {
    favoriteRecipes = []
  }
  return favoriteRecipes
}

/**
 * Method to get the current deleted recipes
 * @returns the deleted recipes
 */
export function getDeletedRecipes () {
  if (!localStorage.getItem(USER_DATA)) { return [] }
  let deletedRecipes = JSON.parse(localStorage.getItem(USER_DATA)).deletedRecipes

  if (!deletedRecipes) {
    deletedRecipes = []
  }
  return deletedRecipes
}

/**
 * Adds a recipe id to the favorites list in the userData item in the local storage
 * @param {String} id - the id of the recipe being added
 */
export function addFavoriteRecipe (id) {
  // change favorite property in the recipe object
  const recipeItem = localStorage.getItem((`${id}`))
  let recipe
  if (recipeItem) {
    recipe = JSON.parse(recipeItem)
    recipe.favorite = true
    localStorage.setItem(id, JSON.stringify(recipe))
  }

  // get the favorites array and add the favorited recipe to the array
  const favArr = getFavoriteRecipes()
  if (favArr) {
    if (!favArr.includes(id)) {
      favArr.push(id)
    }
  }
  updateUserData('favorites', favArr)
}

/**
 * Method to remove the favorite status on a recipe
 * @param {String} id the id for the recipe
 */
export function removeFavoriteRecipe (id) {
  const favArr = getFavoriteRecipes()
  const removed = []

  // change favorite property in the recipe object
  const recipeItem = localStorage.getItem((`${id}`))
  if (recipeItem) {
    const recipe = JSON.parse(recipeItem)
    recipe.favorite = false
    localStorage.setItem(`${id}`, JSON.stringify(recipe))
  }

  for (const recipeID of favArr) {
    if (recipeID !== id) {
      removed.push(recipeID)
    }
  }
  updateUserData('favorites', removed)
}

/**
 * Function to remove the user recipe
 * @param {String} id the user created recipe id
 */
export function removeRecipe (id) {
  localStorage.removeItem(id)
}

/**
 * This function updates the userData stored in localStorage using
 * the Key-Value pair passed in.
 * @param {String} key - The key of the user data being stored.
 * @param {any} value - The data being stored.
 */
export function updateUserData (key, value) {
  let data = localStorage.getItem(USER_DATA)
  if (data) {
    data = JSON.parse(data)
  } else {
    data = {}
  }

  data[key] = value
  localStorage.setItem(USER_DATA, JSON.stringify(data))
}

/**
 * This function query the API multiple times with the fetchRecipes(...) function
 * to get a recipe dump
 */
export async function populateRecipes () {
  return new Promise((resolve, reject) => {
    if (DEFAULT_RECIPE_NUMBER < NUMBER_OF_RECIPES_TO_DISPLAY) {
      reject(Error('DEFAULT_RECIPE_NUMBER is too small'))
      return
    }
    const recipeCount = getRecipesCount()

    let offset = 0
    const userData = localStorage.getItem(USER_DATA) ? JSON.parse(localStorage.getItem(USER_DATA)) : undefined
    if (userData) {
      offset = userData.offset ? userData.offset : 0
    }

    // # of recipes waiting to fetch
    let numberToFetch = DEFAULT_RECIPE_NUMBER - recipeCount

    if (recipeCount >= NUMBER_OF_RECIPES_TO_DISPLAY) {
      resolve(true)
    }

    while (numberToFetch > 0) {
      if (numberToFetch > 100) {
        resolve(fetchRecipes(100, offset))
        offset += 100
        updateUserData('offset', offset)
        numberToFetch -= 100
      } else {
        if (numberToFetch >= NUMBER_OF_RECIPES_TO_DISPLAY) {
          resolve(fetchRecipes(numberToFetch, offset))
        } else {
          fetchRecipes(numberToFetch, offset)
        }
        offset += numberToFetch
        updateUserData('offset', offset)
        numberToFetch = 0
      }
    }
  })
}

/** returns amount of recipes in localStorage
 * @returns {number} length - amount of recipes in localStorage
 */
export function getRecipesCount () {
  let length = Object.keys(localStorage).length
  if (localStorage.getItem(USER_DATA)) {
    length--
  }
  if (localStorage.getItem('latestSearch')) {
    length--
  }
  return length
}

/**
 * This function checks deletedRecipes array in the `userData`
 * and remove recipes which ids are in that array from local storage.
 */
export function removeDeletedRecipes () {
  // remove Recipes in the `deletedRecipes` list
  const deletedRecipes = getDeletedRecipes()
  deletedRecipes.forEach(id => {
    removeRecipe(id.toString())
  })
}

/**
 * This function search through the local storage linearly and returns a list of recipes that
 * matches the word in the query
 * @param {String} query - the query used to search the local storage
 * @returns {JSON[]} - the list of matched recipes
 */
export async function searchLocalRecipes (query) {
  const recipeList = []
  query = query.toLowerCase()
  const localRecipes = getLocalStorageRecipes()

  const endQuery = []
  // if query includes commas
  if (query.includes(',')) {
    // replace commas by space
    query = query.replace(/,/g, ' ')
  }
  // if there are spaces
  const queryTemp = query.split(' ')
  for (const queryWord of queryTemp) {
    if (queryWord !== '') {
      endQuery.push(queryWord)
    }
  }

  // iterate through all recipes and check the title and ingredients for the query
  for (const recipe of localRecipes) {
    const recipeTitle = recipe.title.toLowerCase()
    const recipeIngredients = recipe.ingredientSearch.toLowerCase()
    // if the query is in the recipes then add it to an array
    for (const queryElement of endQuery) {
      if (recipeTitle.includes(queryElement)) {
        recipeList.push(recipe)
        break
      } else if (recipeIngredients.includes(queryElement)) {
        recipeList.push(recipe)
        break
      }
    }
  }
  // return a populated array of recipes relating to the query
  return recipeList
}

/**
 * This function queries the API and gets a fixed amount of recipes
 * with offset in the query.
 * @param {number} recipeCount - The number of recipes to get.
 * @param {number} offset - The number of results to skip.
 * @returns {Promise}
 */
export function fetchRecipes (recipeCount, offset) {
  loadUserData()
  let reqUrl = `${API_ENDPOINT}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true&number=${recipeCount}&offset=${offset}&maxReadyTime=${maxTime}`

  let intolerancesStr = ''
  if (intolerances.length > 0) {
    for (let i = 0; i > intolerances.length; i++) {
      intolerancesStr += `,${intolerances[i]}`
    }
    intolerancesStr = intolerancesStr.slice(1, intolerancesStr.length)
    reqUrl += '&intolerances=' + intolerancesStr
  }

  return new Promise((resolve, reject) => {
    fetch(reqUrl, options)
      .then(res => res.json())
      .then(res => {
        // create local storage items
        res.results.forEach(r => {
          createRecipeObject(r)
        })
        resolve(true)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * This function takes in what is fetched and from those parameters finds what we need for the recipe and sorts it into an object
 * @param {JSON} r - recipe json Object
 */
export async function createRecipeObject (r) {
  if (!r) {
    throw new Error('recipe is undefined')
  }

  const id = r.id
  const readyInMinutes = r.readyInMinutes
  const title = r.title
  const foodImage = r.image
  const size = r.servings
  const favorite = false
  const summary = removeSummaryLinks(r.summary)

  // populating ingredient list
  const apiIngredients = r.missedIngredients ? r.missedIngredients : r.extendedIngredients
  const ingredientObj = extractIngredients(apiIngredients)
  const ingredients = ingredientObj.ingredients
  const ingredientSearch = ingredientObj.ingredientSearch

  // populating nutrition list
  const nutrition = extractNutrition(r.nutrition)

  let steps = ['No Steps']
  if (r.analyzedInstructions) {
    steps = extractSteps(r.analyzedInstructions[0])
  }

  // Create a JSON Object to store the data
  // in the format we specified
  const recipeObject = new RecipeObject(id, title, foodImage, readyInMinutes, ingredientSearch, ingredients, steps, nutrition, favorite, summary, size)
  setLocalStorageItem(r.id, recipeObject)
}

/**
 * extracts nutritional data from api response json object
 * @param {*} nutrition - array of nutritions from API
 * @returns {String[]} - array of nutritions in strings
 */
function extractNutrition (nutrition) {
  const resultArr = []

  if (!nutrition) {
    return DEFAULT_NUTRITIONS
  }

  for (let nutrIndex = 0; nutrIndex < 9; nutrIndex++) {
    const nutrTitle = nutrition.nutrients[nutrIndex].title
    const nutrAmount = nutrition.nutrients[nutrIndex].amount
    const nutrUnit = nutrition.nutrients[nutrIndex].unit
    resultArr.push(nutrTitle + ': ' + nutrAmount + ' ' + nutrUnit)
  }
  return resultArr
}

/**
 * extracts steps data from api response json object
 * @param {*} steps - array of steps from API
 * @returns {String[]} - array of steps in strings
 */
function extractSteps (steps) {
  const resultArr = []

  if (!steps || steps.length === 0) {
    return ['No Steps']
  }

  for (let i = 0; i < steps.length; i++) {
    resultArr.push(steps[i].step)
  }
  return resultArr
}

/**
 * extracts ingredients data from api response json object
 * @param {*} nutrition - array of steps from API
 * @returns {JSON} - array of steps in strings
 */
function extractIngredients (apiIngredients) {
  let ingredientSearch = ''
  const ingredients = []

  if (!apiIngredients) {
    return {
      ingredientSearch: ingredientSearch,
      ingredients: ingredients
    }
  }

  for (let i = 0; i < apiIngredients.length; i++) {
    ingredients.push(apiIngredients[i].original)
    ingredientSearch += apiIngredients[i].name + ' '
  }

  return {
    ingredientSearch: ingredientSearch,
    ingredients: ingredients
  }
}

/**
 * Method to remove the links in summary of the recipes which are unneccesary
 * @returns {String} - a String with all the link texts removed.
 */
export function removeSummaryLinks (summary) {
  const linkTerm = '<a href='
  const linkEnd = '</a>'
  const urlPostfix = 'com'
  if (!summary) {
    return 'No Summary Found'
  }

  const arr = summary.split('.')
  let resultSummary = ''
  arr.forEach(sentence => {
    if (sentence !== '' && !sentence.includes(linkTerm) && !sentence.includes(linkEnd) && !sentence.includes(urlPostfix)) {
      resultSummary = resultSummary + sentence + '.'
    }
  })
  resultSummary = resultSummary.split('<b>').join('')
  resultSummary = resultSummary.split('</b>').join('')
  return resultSummary
}

/**
 * This function get all recipes stored inside the localStorage and return
 * them in a list
 * @returns {JSON[]} - an array of recipes JSON Objects in the localStorage.
 */
export function getLocalStorageRecipes () {
  // get the keys of all recipes in local storage
  const localKeys = Object.keys(localStorage)

  const recipeList = []

  // check to see if local storage is empty, if so then populate local storage
  if (localKeys.length === 0) {
    return recipeList
  }

  for (const key of localKeys) {
    if (key !== USER_DATA && key !== 'latestSearch') {
      recipeList.push(JSON.parse(localStorage.getItem(key)))
    }
  }
  return recipeList
}

/**
 * This function adds the passed in recipe JSON object into local storage
 * @param {number} id - id for the local storage item
 * @param {Object} recipeObject - a JSON recipe object
 */
export function setLocalStorageItem (id, recipeObject) {
  localStorage.setItem(id, JSON.stringify(recipeObject))
}

/**
 * Method to get a given amount of random recipes from local storage
 * @param {number} num - the number of random recipes to get
 * @returns {JSON[]} - `num` amount of random recipes in local storage
 */
export function getNRandomRecipes (num) {
  const recipeCount = getRecipesCount()
  const allRecipes = getLocalStorageRecipes()
  if (num > recipeCount) {
    return allRecipes
  }

  const randomIndexes = getRandomNumbers(num, recipeCount)
  const randomRecipes = []
  randomIndexes.forEach(i => {
    randomRecipes.push(allRecipes[i])
  })
  return randomRecipes
}

/**
 * Method to get a random integer
 * @param {number} count - number of random integers
 * @param {number} max - the max value
 * @returns {number[]} random number between 0 and the parameter
 */
function getRandomNumbers (count, max) {
  const randomArr = []
  while (randomArr.length < count) {
    const randInt = Math.floor(Math.random() * max)
    if (!randomArr.includes(randInt)) {
      randomArr.push(randInt)
    }
  }

  return randomArr
}

/**
 * Web Scrapping method for additional functionality for creating recipes
 * @param {String} url - the url inputted to scrap
 * @return {JSON} the json data of that website
 */
export function webScrapper (url) {
  const urlToExtract = `${API_ENDPOINT}/recipes/extract?apiKey=${API_KEY}&url=${url}&analyze=true`
  return new Promise((resolve, reject) => {
    fetch(urlToExtract, options)
      .then(res => res.json())
      .then(res => {
        createRecipeObject(res)
        resolve(true)
      })
      .catch(error => {
        reject(error)
      })
  })
}
