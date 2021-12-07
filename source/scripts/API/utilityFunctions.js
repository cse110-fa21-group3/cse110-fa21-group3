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

export const DEFAULT_RECIPE_NUMBER = 201
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

/**
 * This function updates the intolerances of the user which is used when
 * fetching recipes from the API
 * @param {string} inputIntol - A string of the intolerances.
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
 * @param {string} time - A string containing the maxTime.
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
 * @param {string} id - the id of the recipe being added
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
 * @param {string} id the id for the recipe
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
 * @param {string} id the user created recipe id
 */
export function removeRecipe (id) {
  localStorage.removeItem(id)
}

/**
 * This function updates the userData stored in localStorage using
 * the Key-Value pair passed in.
 * @param {string} key - The key of the user data being stored.
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
        if (numberToFetch > NUMBER_OF_RECIPES_TO_DISPLAY) {
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
 * @param {string} query - the query used to search the local storage
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
  const id = r.id ? r.id : '-0'
  const readyInMinutes = r.readyInMinutes ? r.readyInMinutes : 'unkown'
  const title = r.title ? r.title : 'Website Food'
  const foodImage = r.image ? r.image : './image/team3-logo.jpg'
  const favorite = false

  const summary = removeSummaryLinks(r.summary).replaceAll("<b>", "").replaceAll("</b>", "")
  const size = r.servings ? r.servings : 'unknown'

  // populating ingredient list
  const apiIngredients = r.missedIngredients ? r.missedIngredients : r.extendedIngredients
  const ingredients = []
  let ingredientSearch = ''
  if (apiIngredients) {
    apiIngredients.forEach(ingre => {
      ingredients.push(ingre.original)
      ingredientSearch += ingre.name + ' '
    })
  }

  // populating nutrition list
  let nutrition = []
  if (r.nutrition) {
    for (let nutrIndex = 0; nutrIndex < 9; nutrIndex++) {
      const nutrTitle = r.nutrition.nutrients[nutrIndex].title
      const nutrAmount = r.nutrition.nutrients[nutrIndex].amount
      const nutrUnit = r.nutrition.nutrients[nutrIndex].unit
      nutrition.push(nutrTitle + ': ' + nutrAmount + ' ' + nutrUnit)
    }
  } else {
    nutrition = DEFAULT_NUTRITIONS
  }

  let steps = []
  if (r.analyzedInstructions && r.analyzedInstructions[0]) {
    r.analyzedInstructions[0].steps.forEach(recipeStep => {
      steps.push(recipeStep.step)
    })
  } else {
    steps = 'No Steps'
  }

  // Create a JSON Object to store the data
  // in the format we specified
  const recipeObject = {
    id: id,
    title: title,
    image: foodImage,
    readyInMinutes: readyInMinutes,
    ingredientSearch: ingredientSearch,
    ingredients: ingredients,
    steps: steps,
    nutrition: nutrition,
    favorite: favorite,
    summary: summary,
    servingSize: size
  }
  setLocalStorageItem(r.id, recipeObject)
}

/**
 * Method to remove the links in summary of the recipes which are unneccesary
 * @returns {String} - a String with all the link texts removed.
 */
export function removeSummaryLinks (summary) {
  const linkTerm = '<a href='
  const linkEnd = '</a>'
  if (!summary) {
    return ''
  }
  while (summary.includes(linkTerm) && summary.includes(linkEnd) && summary.indexOf(linkTerm) < summary.indexOf(linkEnd)) {
    const indexOfFirstLink = summary.indexOf(linkTerm)
    const indexOfEndLink = summary.indexOf(linkEnd)

    let firstHalf = summary.substring(0, indexOfFirstLink)
    const lastPeriodIndex = firstHalf.lastIndexOf('.')
    firstHalf = (lastPeriodIndex >= 0) ? firstHalf.substring(0, lastPeriodIndex + 1) : firstHalf

    let secondHalf = summary.substring(indexOfEndLink + 4)

    let periodIndex, urlPostfixIndex
    do {
      periodIndex = secondHalf.indexOf('.')
      urlPostfixIndex = secondHalf.indexOf('.com')
      if (periodIndex < 0) { break }
      if (periodIndex >= secondHalf.length - 1) {
        secondHalf = ''
        break
      }
      secondHalf = secondHalf.substring(periodIndex + 1)
    } while (periodIndex === urlPostfixIndex)

    summary = firstHalf + secondHalf
  }
  return summary
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
 * @param {string} url - the url inputted to scrap
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
