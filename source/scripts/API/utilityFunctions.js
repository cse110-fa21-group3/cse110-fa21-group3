import { Router } from '../router.js'

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

// Create a new Router for handling pages
export var router = new Router(() => {
  window.location.href = '/index.html'
})

export const DEFAULT_RECIPE_NUMBER = 10
const DEFAULT_MAX_TIME = 60
export const MINIMUM_RECIPE_REQUIRED = 5
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
// list of user Intolerances
let intolerances = []
// max for recipes prep time
let maxTime = DEFAULT_MAX_TIME
// user data variables
const USER_DATA = 'userData'

/**
 * Just a testing function for the start up
 */
function init () {
  loadUserData()
  console.log(intolerances)
  console.log(maxTime)
}

/**
 * This function updates the intolerances of the user which is used when
 * fetching recipes from the API
 * @param {string} inputIntol - A string of the intolerances.
 */
export function setIntolerances (inputIntol) {
  if (inputIntol == '') {
    updateUserData('intolerances', [])
    return
  }

  // format the intolerance string by pattern matching
  console.log(inputIntol)
  // Expected format: in1, in2, in3, ...
  const inputArray = inputIntol.toLowerCase().replace(/\s/g, '').split(',')
  console.log(inputArray)
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
function setMaxTime (time) {
  if (time == '') {
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
function loadUserData () {
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
  const userData = JSON.parse(localStorage.getItem(USER_DATA))
  let favoriteRecipes
  if (userData) {
    favoriteRecipes = userData.favorites
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
  const userData = JSON.parse(localStorage.getItem(USER_DATA))

  let deletedRecipes
  if (userData) {
    deletedRecipes = userData.deletedRecipes
  }

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
  } else {
    return
  }

  // get the favorites array and add the favorited recipe to the array
  let favArr = getFavoriteRecipes()
  if (favArr) {
    if (!favArr.includes(id)) {
      favArr.push(id)
    }
  } else {
    favArr = [id]
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
  } else {
    return
  }

  for (const recipeID of favArr) {
    if (recipeID != id) {
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
  console.log(JSON.parse(localStorage.getItem(USER_DATA)))
}

/**
 * This function query the API multiple times with the fetchRecipes(...) function
 * to get a recipe dump
 * @param {number} total_count - The total number of recipes to get from API.
 */
export async function populateRecipes (total_count) {
  let offset = 0
  // get recipes by 100s
  const repeat_times = Math.round(total_count / 100)
  // get marginal recipes
  const remain_number = total_count % 100

  return new Promise((resolve, reject) => {

    // repeat getting 100 recipes at a time
    // Because that's tha max amount the API returns per call
    for (let i = 0; i < repeat_times; i++) {
        fetchRecipes(100, offset).then(() => {
            if (getRecipesCount() >= MINIMUM_RECIPE_REQUIRED) {
                removeDeletedRecipes()
                resolve(true)
            }
        })
        offset += 100
    }

    // getting the remaining amount (< 100 recips)
    if (remain_number > 0) {
        fetchRecipes(remain_number, offset).then(() => {
            if (getRecipesCount() >= MINIMUM_RECIPE_REQUIRED) {
                removeDeletedRecipes()
                resolve(true)
            }
        })
        offset += remain_number
    }
  })
}

function getRecipesCount() {
  let length = localStorage.length
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
function removeDeletedRecipes() {
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
  let localRecipes = getLocalStorageRecipes()
  console.log(localRecipes)
  if (!localRecipes) {
    populateRecipes(DEFAULT_RECIPE_NUMBER)
    localRecipes = getLocalStorageRecipes()
  }

  const endQuery = []
  // if query includes commas
  if (query.includes(',')) {
    // replace commas by space
    query = query.replace(/,/g, ' ')
  }
  // if there are spaces
  const queryTemp = query.split(' ')
  for (const queryWord of queryTemp) {
    if (queryWord != '') {
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
 * @param {number} recipe_count - The number of recipes to get.
 * @param {number} offset - The number of results to skip.
 * @returns {Promise}
 */
export async function fetchRecipes (recipe_count, offset) {
  loadUserData()
  let reqUrl = `${API_ENDPOINT}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true&number=${recipeCount}&offset=${offset}&readyReadyTime=${maxTime}`
  let intolerancesStr = ''
  if (intolerances.length > 0) {
    intolerances.forEach(i => intolerancesStr += `,${i}`)
    intolerancesStr = intolerancesStr.slice(1, intolerancesStr.length)
    console.log(intolerancesStr)
    reqUrl += '&intolerances=' + intolerancesStr
  }

  return new Promise((resolve, reject) => {
    fetch(reqUrl, options)
      .then(res => res.json())
      .then(res => {
        // Find the expected length of recipes in the local storage
        const expectedLength = res.results.length
        const originalLength = getRecipesCount()

        console.log(res)
        // create local storage items
        res.results.forEach(async r => {
          createRecipeObject(r).then(() => {

            // Find amount of recipes in the local storage
            // filtering out `userData` and `latestSearch`
            let recipesCount = getRecipesCount()
            // resolves when expected amount of recipes is met.
            if (recipesCount - originalLength >= MINIMUM_RECIPE_REQUIRED) {
              resolve(true)
            }
          })
          .catch(err => {
            console.log(err)
            reject(false)
          })
        })
      })
      .catch(error => {
        reject(false)
      })
  })
}

/**
 * Gets the summary of a specific recipe with its id
 * @param {string} id - id of the recipe to be removed.
 */
async function fetchSummary (id) {
  const reqUrl = `${API_ENDPOINT}/recipes/${id}/summary`
  return new Promise((resolve, reject) => {
    fetch(reqUrl, options)
      .then(res => res.json())
      .then(res => {
        resolve(res.summary)
      })
      .catch(error => {
        console.log(error)
        reject(false)
      })
  })
}

/**
 * This function takes in what is fetched and from those parameters finds what we need for the recipe and sorts it into an object
 * @param {JSON} r - recipe json Object
 */
export async function createRecipeObject (r) {
  const id = r.id
  const readyInMinutes = r.readyInMinutes
  const title = r.title
  const foodImage = r.image
  const favorite = false

  const summary = removeSummaryLinks(r.summary)
  const size = r.servings

  // populating ingredient list
  const ingredients = []
  let ingredientSearch = ''
  r.missedIngredients.forEach(ingre => {
    ingredients.push(ingre.original)
    ingredientSearch += ingre.name + ' '
  })

  // populating nutrition list
  const nutrition = []
  for (let nutr_index = 0; nutr_index < 9; nutr_index++) {
    const nutr_title = r.nutrition.nutrients[nutr_index].title
    const nutr_amount = r.nutrition.nutrients[nutr_index].amount
    const nutr_unit = r.nutrition.nutrients[nutr_index].unit
    nutrition.push(nutr_title + ': ' + nutr_amount + ' ' + nutr_unit)
  }

  // TODO: Optimize the steps array, now it has ingredients inside,
  //       which we don't need
  const steps = []
  r.analyzedInstructions[0].steps.forEach(recipeStep => {
    steps.push(recipeStep.step)
  })

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
 * 
 * @returns {String} - a String with all the link texts removed.
 */
function removeSummaryLinks(summary) {
  const linkTerm = '<a href='
  while (summary.indexOf(linkTerm) !== -1) {
    let indexOfFirstLink = summary.indexOf(linkTerm)
    let indexOfPeriodBefore = summary.lastIndexOf('.', indexOfFirstLink)
    let indexOfLinkPostFix = summary.indexOf('.com')
    let indexOfPeriodAfter = indexOfLinkPostFix
    while (indexOfPeriodAfter === indexOfLinkPostFix) {
      indexOfPeriodAfter = summary.indexOf('.', indexOfPeriodAfter+1)
      indexOfLinkPostFix = summary.indexOf('.com', indexOfLinkPostFix+1)
    }

    let temp = summary.substring(0, indexOfPeriodBefore+1) + summary.substring(indexOfPeriodAfter+1)
    console.log(summary)
    console.log(temp)
    summary = temp
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
  if (!localKeys) {
    return recipeList
  }

  for (const key of localKeys) {
    if (key != USER_DATA && key != 'latestSearch') {
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
