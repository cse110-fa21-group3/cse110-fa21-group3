/**
 * Homepage JS file
 */

import * as util from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", init);

document.getElementById("create-recipe").addEventListener('click', e => {
    window.location.href = "/createRecipe.html";
});

/**
 * Function that runs when the page loads
 */
function init(){
    getUserPrefs();
  
    // display the 5 recipes and add search btn listener only in homepage
    if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '') {
        createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY)
        let searchBtn = document.getElementById("search");
        searchBtn.addEventListener("click", e => {
            e.preventDefault();
            let searchQuery = document.getElementById("search-query").value;
            util.searchLocalRecipes(searchQuery).then(searchResults => {
                let resIds = [];
                searchResults.forEach(recipe => {
                    resIds.push(recipe["id"]);

                });
                let searchObj = {
                    "data": resIds,
                    "query": searchQuery,
                    "matchedCount": searchResults.length
                }
                localStorage.setItem("latestSearch", JSON.stringify(searchObj));
                window.location.href = "/searchpage.html";
            });
        });
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
 * @param {boolean} search If you're creating recipe cards from a search query
 * 
 */
export function createRecipeCards(N){ 
    let recipes = util.getNRandomRecipes(N);
    // Get the recipe cards' section element
    let recipeCardsSection = document.getElementById("recipe-cards");

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
        window.location.href = "/recipePage.html#"+key;
    });
}

function getUserPrefs(){
    if(util.getLocalStorageRecipes().length == 0){
        util.updateUserData('offset', 0)
        let intols = prompt("Enter your intolerances (ingredients not to include)\n\nAvailable: dairy, gluten, shellfish, seafood, wheat, eggs, peanut, soy, grain, sesame, tree nut, sulfite");
        if(intols || intols === ""){
            util.setIntolerances(intols);
        }

        let maxTime = prompt("Enter the maximum amount of time you'd want to spend making a recipe (in minutes)");
        if(maxTime || !isNaN(Number(maxTime))){
            util.setMaxTime(maxTime);
        }

        util.populateRecipes(util.DEFAULT_RECIPE_NUMBER).then(() => {
            createRecipeCards(util.MINIMUM_RECIPE_REQUIRED);
        });
    }
}