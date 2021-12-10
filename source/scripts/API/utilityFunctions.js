import * as localStorageHandler from './localStorageHandler.js'

let serverURL;

fetch(".netlify/functions/api")
.then(response => response.json())
.then(json => {
    serverURL = json.api;
})

// API Key and endpoint
const API_KEY = process.env.API_KEY
// const API_KEY = '6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f'
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

export const DEFAULT_RECIPE_NUMBER = 100
export const NUMBER_OF_RECIPES_TO_DISPLAY = 10
export const DEFAULT_OFFSET = 200

export const DEFAULT_NUTRITIONS = [
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

// user data variables

// list of user Intolerances
export let intolerances = []
// max for recipes prep time
export let maxTime = localStorageHandler.DEFAULT_MAX_TIME
export let offset = DEFAULT_OFFSET

class RecipeObject {
  constructor (id, title, foodImage, readyInMinutes, ingredientSearch, ingredients, steps, nutrition, favorite, summary, size, dishTypes) {
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
    this.dishTypes = dishTypes || []
  }
}

/**
 * This function loads the userData stored in localStorage and
 * sets the `intolerances` variable and the `maxTime` variable
 */
export function loadUserData () {
  let data = localStorage.getItem(localStorageHandler.USER_DATA)
  if (data) {
    data = JSON.parse(data)
  } else {
    intolerances = []
    maxTime = localStorageHandler.DEFAULT_MAX_TIME
    offset = DEFAULT_OFFSET
    return
  }

  intolerances = data.intolerances ? data.intolerances : []
  maxTime = data.maxTime ? data.maxTime : localStorageHandler.DEFAULT_MAX_TIME
  offset = data.offset ? data.offset : 0
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
    loadUserData()
    const recipeCount = localStorageHandler.getRecipesCount()

    // # of recipes waiting to fetch
    let remainCount = DEFAULT_RECIPE_NUMBER - recipeCount
    let fetchOffset = offset

    if (recipeCount >= NUMBER_OF_RECIPES_TO_DISPLAY) {
      resolve(true)
    }

    let numberToFetch = 0
    while (remainCount > 0) {
      numberToFetch = (remainCount >= 100) ? 100 : remainCount

      if (numberToFetch >= NUMBER_OF_RECIPES_TO_DISPLAY) {
        resolve(fetchRecipes(numberToFetch, fetchOffset).then(offsetFinished => updateOffset(offsetFinished)))
      } else {
        fetchRecipes(numberToFetch, fetchOffset).then(offsetFinished => updateOffset(offsetFinished))
      }
      fetchOffset += numberToFetch
      remainCount -= numberToFetch
    }
  })
}

export function updateOffset (offsetToAdd) {
  loadUserData()
  localStorageHandler.updateUserData('offset', offset + offsetToAdd)
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
    for (let i = 0; i < intolerances.length; i++) {
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
        resolve(recipeCount)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * This function takes in what is fetched and from those parameters finds what we need for the recipe and sorts it into an object
 * @param {JSON} r - recipe json Object
 * @param {boolean} isWebScrapper
 */
export async function createRecipeObject (r, isWebScrapper = false) {
  if (!r) { throw new Error('Undefined Recipe Found') }

  let id = r.id
  if (isWebScrapper) {
    id = generateUniqueID('')
  }

  const readyInMinutes = r.readyInMinutes
  const title = r.title
  const foodImage = r.image
  const size = r.servings
  const favorite = false
  const dishTypes = r.dishTypes
  const summary = removeSummaryLinks(r.summary)

  // populating ingredient list
  const apiIngredients = r.missedIngredients ? r.missedIngredients : r.extendedIngredients
  const ingredientObj = extractIngredients(apiIngredients, title)
  const ingredients = ingredientObj.ingredients
  const ingredientSearch = ingredientObj.ingredientSearch

  // populating nutrition list
  const nutrition = extractNutrition(r.nutrition)

  let steps = ['No Steps']
  if (r.analyzedInstructions.length > 0) {
    steps = extractSteps(r.analyzedInstructions[0].steps)
  }

  // Create a JSON Object to store the data
  // in the format we specified
  const recipeObject = new RecipeObject(id, title, foodImage, readyInMinutes, ingredientSearch, ingredients, steps, nutrition, favorite, summary, size, dishTypes)
  localStorageHandler.setLocalStorageItem(id, recipeObject)
  return id
}

/**
 * Generates an unique random ID
 * @param {*} id before modified, the id of the recipe
 * @returns {string} randomized unique id
 */
export function generateUniqueID (id) {
  id = 'ucr_' + id
  while (localStorage.getItem(id)) {
    id += Math.floor(Math.random() * 10)
  }
  return id
}

/**
 * Web Scrapping method for additional functionality for creating recipes
 * @param {String} url - the url inputted to scrap
 * @return {Promise} the json data of that website
 */
export function webScrapper (url) {
  const urlToExtract = `${API_ENDPOINT}/recipes/extract?apiKey=${API_KEY}&url=${url}&analyze=true`
  return new Promise((resolve, reject) => {
    fetch(urlToExtract, options)
      .then(res => res.json())
      .then(res => {
        resolve(createRecipeObject(res, true))
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * extracts nutritional data from api response json object
 * @param {*} nutrition - array of nutritions from API
 * @returns {String[]} - array of nutritions in strings
 */
export function extractNutrition (nutrition) {
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
export function extractSteps (steps) {
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
 * @param {*} title - title of recipe
 * @returns {JSON} - array of steps in strings
 */
export function extractIngredients (apiIngredients, title) {
  const ingredientSearch = {}
  const ingredients = []

  if (title) {
    const titleArr = title.split(' ')
    titleArr.forEach(item => {
      ingredientSearch[item.toLowerCase()] = 1
    })
  }

  if (!apiIngredients) {
    return {
      ingredientSearch: ingredientSearch,
      ingredients: ingredients
    }
  }

  for (let i = 0; i < apiIngredients.length; i++) {
    ingredients.push(apiIngredients[i].original)
    ingredientSearch[apiIngredients[i].name.toLowerCase()] = 1
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
