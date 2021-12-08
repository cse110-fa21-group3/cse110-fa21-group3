/**
 * Homepage JS file
 */

import * as util from './API/utilityFunctions.js'
import * as LSHandler from './API/localStorageHandler.js'

let isButtonsExpanded = false

window.addEventListener('DOMContentLoaded', init)

document.getElementById('create-recipe').addEventListener('click', e => {
  console.log('clicked')
  const manual_btn = document.getElementById('manual_btn')
  const scrapper_btn = document.getElementById('webscrapper_btn')
  let create_btn = document.getElementById('create-recipe')
  if (!isButtonsExpanded) {
    manual_btn.classList.remove('shift-down-manual')
    scrapper_btn.classList.remove('shift-down-webscrapper')
    manual_btn.classList.add('shift-up-manual')
    scrapper_btn.classList.add('shift-up-webscrapper')
    create_btn.classList.add('highlight-btn')
    isButtonsExpanded = true
  }else {
    manual_btn.classList.remove('shift-up-manual')
    scrapper_btn.classList.remove('shift-up-webscrapper')
    create_btn.classList.remove('highlight-btn')
    manual_btn.classList.add('shift-down-manual')
    scrapper_btn.classList.add('shift-down-webscrapper')
    create_btn.classList.remove('highlight-btn')
    isButtonsExpanded = false
  }
})

document.getElementById('manual_btn').addEventListener('click', e => {
  window.location.href = '/createRecipe.html'
})

document.getElementById('webscrapper_btn').addEventListener('click', e => {
  console.log("webscrapper")
})


/**
 * Function that runs when the page loads
 */
function init () {
  getUserPrefs()

  // display the 5 recipes and add search btn listener only in homepage
  if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '') {
    createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'explore-recipes')
    createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'breakfast-recipes')
    createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'desserts-recipes')
    const searchBtn = document.getElementById('search')
    searchBtn.addEventListener('click', e => {
      e.preventDefault()
      const searchQuery = document.getElementById('search-query').value
      LSHandler.searchLocalRecipes(searchQuery).then(() => {
        window.location.href = '/searchpage.html'
      })
    })
  }

  // let searchBtn = document.getElementById("search");
  // searchBtn.addEventListener("click", e => {
  //     e.preventDefault();
  //     let searchQuery = document.getElementById("search-query").value;
  //     util.searchLocalRecipes(searchQuery).then(arr => {
  //         let res = [];
  //         arr.forEach(recipe => {
  //             res.push(recipe["id"]);
  //         });
  //         console.log(res);
  //         let searchObj = {
  //             "data": res,
  //             "query": searchQuery,
  //             "matchedCount": arr.length
  //         }
  //         localStorage.setItem("latestSearch", JSON.stringify(searchObj));
  //         window.location.href = "/source/searchpage.html";
  //     });
  // });
}

/**
 * Create recipe cards for an arbitrary amount of recipes
 *
 * @param {number} N The number of recipes to display
 * @param {string} id The id of the section to display
* @param {boolean} search If you're creating recipe cards from a search query
 *
 */
export function createRecipeCards (N, id) {
  const recipes = LSHandler.getNRandomRecipes(N)
  // Get the recipe cards' section element
  const recipeCardsSection = document.getElementById(id)

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('recipe-card')
    recipeCard.data = recipe
    const key = recipe.id
    bindRC(recipeCard, key)
    recipeCardsSection.appendChild(recipeCard)
  })
}

/**
 * Binds a recipe card to its router page function via the 'click' event
 *
 * @param {HTMLElement} recipeCard The element to which we bind an event listener
 * @param {string} key The id of the recipe card
 */
function bindRC (recipeCard, key) {
  recipeCard.addEventListener('click', e => {
    window.location.href = '/recipePage.html#' + key
  })
}

function getUserPrefs () {
  if (LSHandler.getLocalStorageRecipes().length === 0) {
    LSHandler.updateUserData('offset', 0)
    const intols = prompt('Enter your intolerances (ingredients not to include)\n\nAvailable: dairy, gluten, shellfish, seafood, wheat, eggs, peanut, soy, grain, sesame, tree nut, sulfite')
    LSHandler.setIntolerances(intols)

    const maxTime = prompt("Enter the maximum amount of time you'd want to spend making a recipe (in minutes)")
    LSHandler.setMaxTime(maxTime)

    util.populateRecipes().then(() => {
      createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'explore-recipes')
      createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'breakfast-recipes')
      createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'desserts-recipes')
    })
  }
}
