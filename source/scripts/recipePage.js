import * as LSHandler from './API/localStorageHandler.js'

const id = window.location.hash.slice(1)
const ingredientElementArr = []
const nutritionElementArr = []
let defaultServing
let defaultIngredients
let defaultNutrition

window.addEventListener('DOMContentLoaded', init)

/**
 * The Initialization of the recipe page and the elements inside the recipe
 */
function init () {
  const eTitle = document.getElementById('recipe-title') // done
  const eImage = document.getElementById('recipe-image') // done
  // const eTags = document.getElementById('recipe-tags') // don't have
  const eTime = document.getElementById('recipe-time') // done
  const eServes = document.getElementById('recipe-serves') // done
  const eDescription = document.getElementById('recipe-description') // don't have

  // Preferably, we would have a function from the API utils that gets recipe data for us
  let data = localStorage.getItem(id) // get the recipe data (here it's a string)
  if (!data) { return }
  data = JSON.parse(data) // parse the string rep of the object to create an object
  document.querySelector('head > title').innerText = data.title

  // Set data values
  eTitle.innerText = data.title
  eImage.setAttribute('src', data.image)
  eTime.innerText = data.readyInMinutes
  defaultIngredients = data.ingredients
  defaultNutrition = data.nutrition

  eServes.value = data.servingSize
  defaultServing = data.servingSize
  eDescription.innerHTML = data.summary ? data.summary : ''

  populateListElements(data.ingredients, 'recipe-ingredients-list')
  populateListElements(data.steps, 'recipe-steps-list')
  populateListElements(data.nutrition, 'recipe-nutrition-list')
  setUpBtns()
  eServes.addEventListener('change', (event) => {
    ingredientUpdates(eServes.value)
    nutritionUpdates(eServes.value)
  })
}

/**
 * updates values in nutrition according to servingSize
 * @param {*} servingSize
 */
function nutritionUpdates (servingSize) {
  if (nutritionElementArr.length <= 0) {
    return
  }

  const ratio = servingSize / defaultServing

  for (let index = 0; index < nutritionElementArr.length; index++) {
    const element = nutritionElementArr[index]

    const nutrString = defaultNutrition[index]
    if (ratio === 1) {
      element.innerText = defaultNutrition[index]
      continue
    }

    const match = nutrString.match(/[+-]?([0-9]*[.])?[0-9]+/)

    if (!match) {
      continue
    }

    const length = match[0].length
    const matchIndex = match.index
    const endIndex = (matchIndex + length)
    let amount = parseFloat(match[0])

    amount = (amount * ratio).toFixed(2)
    element.innerText = nutrString.substring(0, matchIndex) + ': ' + amount + ' ' + nutrString.substring(endIndex)
  }
}

/**
 * updates values in ingredients according to servingSize
 * @param {*} servingSize
 */
function ingredientUpdates (servingSize) {
  if (ingredientElementArr.length <= 0) {
    return
  }

  const ratio = servingSize / defaultServing

  const fractionPattern = /([0-9]*\/)?[0-9]+/

  for (let i = 0; i < ingredientElementArr.length; i++) {
    const element = ingredientElementArr[i]
    const ingString = defaultIngredients[i]
    if (ratio === 1) {
      element.innerText = ingString
      continue
    }

    const match = ingString.match(fractionPattern)

    if (!match || match.index > 0) {
      element.innerText = ratio + ' ' + ingString
      continue
    }

    if (match.index === 0) {
      let amount = match[0].includes('/') ? evaluateFraction(match[0]) : parseFloat(match[0])
      amount = (amount * ratio).toFixed(2)
      const length = match[0].length
      element.innerText = amount + ingString.substring(length)
    }
  }
}

/**
 * evaluate Fraction number in string format
 * @param {*} frac
 * @returns {number}
 */
function evaluateFraction (frac) {
  const strArr = frac.split('/')
  return parseFloat(strArr[0]) / parseFloat(strArr[1]).toFixed(2)
}

/**
 * creates list elements for recipe page
 * @param {*} dataArr
 * @param {*} listID
 */
function populateListElements (dataArr, listID) {
  const list = document.getElementById(listID)
  dataArr.forEach(data => {
    const item = document.createElement('li')
    item.innerText = data
    if (listID === 'recipe-ingredients-list') { ingredientElementArr.push(item) }
    if (listID === 'recipe-nutrition-list') { nutritionElementArr.push(item) }
    list.appendChild(item)
  })
}

/**
 * set up buttons for recipe page
 */
function setUpBtns () {
  const favoriteBtn = document.getElementById('favorite')
  let favArr = LSHandler.getFavoriteRecipes()
  if (favArr && favArr.includes(id)) {
    favoriteBtn.classList.add('liked')
  }

  favoriteBtn.addEventListener('click', e => {
    favArr = LSHandler.getFavoriteRecipes()
    if (favArr && favArr.includes(id)) {
      LSHandler.removeFavoriteRecipe(id)
    } else {
      LSHandler.addFavoriteRecipe(id)
    }
  })

  const deleteBtn = document.getElementById('delete')
  let deletedRecipes = LSHandler.getDeletedRecipes()
  deleteBtn.addEventListener('click', e => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      LSHandler.removeRecipe(id)

      deletedRecipes = LSHandler.getDeletedRecipes()
      deletedRecipes.push(parseInt(id))
      LSHandler.updateUserData('deletedRecipes', deletedRecipes)

      window.location.href = '/index.html'
    }
  })

  const searchBtn = document.getElementById('search-icon')
  searchBtn.addEventListener('click', e => {
    e.preventDefault()
    const searchQuery = document.getElementById('search-bar').value
    LSHandler.searchLocalRecipes(searchQuery).then(() => {
      window.location.href = '/searchpage.html'
    })
  })
}

// changing the color
document.querySelector('#favorite').addEventListener('click', (e) => {
  e.currentTarget.classList.toggle('liked')
})

document.getElementById('edit-recipe').addEventListener('click', e => {
  window.location.href = '/createRecipe.html#' + id
})
