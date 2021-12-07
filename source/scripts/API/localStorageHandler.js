export const DEFAULT_MAX_TIME = 60
export const USER_DATA = 'userData'
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

/**
 * This function updates the intolerances of the user which is used when
 * fetching recipes from the API
 * @param {String} inputIntol - A string of the intolerances.
 */
export function setIntolerances (inputIntol) {
  if (!inputIntol || inputIntol === '') {
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
  if (!time || time === '') {
    updateUserData('maxTime', DEFAULT_MAX_TIME)
    return
  }
  const maxTime = parseInt(time)

  // Update the userData in localStorage
  updateUserData('maxTime', maxTime)
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
 * This function search through the local storage linearly and returns a list of recipes that
 * matches the word in the query
 * @param {String} query - the query used to search the local storage
 * @returns {JSON[]} - the list of matched recipes
 */
export async function searchLocalRecipes (query) {
  const recipeList = []
  query = query.toLowerCase()
  const localRecipes = getLocalStorageRecipes()

  // replace query commas with space and replace duplicate spaces.
  query = query.replace(/,/g, ' ')
  query = query.replace(/\s+/g, ' ')

  // if there are spaces
  const endQuery = query.split(' ')

  // iterate through all recipes and check the title and ingredients for the query
  for (const recipe of localRecipes) {
    const recipeTitle = recipe.title.toLowerCase()
    const recipeIngredients = recipe.ingredientSearch.toLowerCase()
    // if the query is in the recipes then add it to an array
    for (const queryElement of endQuery) {
      if (recipeTitle.includes(queryElement)) {
        recipeList.push(recipe)
        break
      }else if (recipeIngredients.includes(queryElement)) {
        recipeList.push(recipe)
        break
      }
    }
  }
  // return a populated array of recipes relating to the query
  return recipeList
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
 * This function adds the passed in recipe JSON object into local storage
 * @param {number} id - id for the local storage item
 * @param {Object} recipeObject - a JSON recipe object
 */
export function setLocalStorageItem (id, recipeObject) {
  localStorage.setItem(id, JSON.stringify(recipeObject))
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
