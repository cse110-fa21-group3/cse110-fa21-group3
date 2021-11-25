/**
 * Homepage JS file
 */

import * as util from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", init);

let createRecipeButton = document.getElementById("create-recipe");
createRecipeButton.addEventListener('click', e => {
    window.location.href = "/source/createRecipe.html";
});

/**
 * Function that runs when the page loads
 */
function init(){
    if(util.getLocalStorageRecipes().length == 0){
        let intols = prompt("Enter your intolerances");
        if(intols){
            util.setIntolerances(intols);
        }
    }
    util.fetchRecipes(util.DEFAULT_RECIPE_NUMBER, 0).then(() => {
        createRecipeCards(util.DEFAULT_RECIPE_NUMBER);
    });

    let searchBtn = document.getElementById("search");
    searchBtn.addEventListener("click", e => {
        let searchQuery = document.getElementById("searchQuery").value;
        util.searchLocalRecipes(searchQuery).then(arr => {
            let res = [];
            arr.forEach(recipe => {
                res.push(recipe["id"]);
            });
            console.log(res);
            let searchObj = {
                "data": res,
                "query": searchQuery,
                "matchedCount": arr.length
            }
            localStorage.setItem("latestSearch", JSON.stringify(searchObj));
            window.location.href = "/source/searchpage.html";
        });
    });
}

/**
 * Create recipe cards for an arbitrary amount of recipes
 * 
 * @param {number} N The number of recipes to display
 * @param {boolean} search If you're creating recipe cards from a search query
 * 
 */
export function createRecipeCards(N){ 
    let recipes = util.getLocalStorageRecipes();
    // Get the recipe cards' section element
    let recipeCardsSection = document.getElementById("recipeCards");

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("recipe-card");
        recipeCard.data = recipe;
        let key = recipe["id"];
        bindRC(recipeCard, key);
        recipeCardsSection.appendChild(recipeCard);
    });
}

/**
 * Binds a recipe card to its router page function via the 'click' event
 * 
 * @param {HTMLElement} recipeCard The element to which we bind an event listener
 * @param {string} key The id of the recipe card
 */
function bindRC(recipeCard, key){
    recipeCard.addEventListener("click", e => {
        util.router.navigate(key);
    });
}