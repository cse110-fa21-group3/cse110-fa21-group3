/**
 * Homepage JS file
 */

import * as util from './API/utilityFunctions.js'
import * as LSHandler from './API/localStorageHandler.js'

window.addEventListener('DOMContentLoaded', init)

document.getElementById('create-recipe').addEventListener('click', e => {
  document.getElementById('create-recipe').classList.toggle('rotate-btn')
  const manualBtn = document.getElementById('manual-btn')
  const scrapperBtn = document.getElementById('webscrapper-btn')
  manualBtn.classList.toggle('manual-show')
  manualBtn.classList.toggle('manual-hide')
  scrapperBtn.classList.toggle('scrapper-show')
  scrapperBtn.classList.toggle('scrapper-hide')
})

document.getElementById('manual-btn').addEventListener('click', e => {
  window.location.href = '/createRecipe.html'
})

document.getElementById('webscrapper-btn').addEventListener('click', e => {
  console.log('webscrapper')
})

/**
 * Function that runs when the page loads
 */
function init () {
  getUserPrefs()
  console.log(LSHandler.getRecipesByType(20, 'salad'))

  if (document.getElementById('refresh_btn')) {
    setUpRefreshButton()
  }

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
    LSHandler.updateUserData('offset', util.DEFAULT_OFFSET)
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

/**
 * sets up the refresh button for the explore cointaner on homepage
 */
function setUpRefreshButton () {
  document.getElementById('refresh_btn').addEventListener('click', event => {
    const exploreContainer = document.getElementById('explore-recipes')
    while (exploreContainer.firstChild) {
      exploreContainer.removeChild(exploreContainer.firstChild)
    }
    createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY, 'explore-recipes')
  })
}
