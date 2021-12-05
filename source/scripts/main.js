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
    let isFirstTime = false
    if(util.getRecipesCount() === 0){
        isFirstTime = true
        let intols = prompt("Enter your intolerances");
        if(intols || intols === ""){
            util.setIntolerances(intols);
        }
        util.updateUserData('offset', 0)
    }

    util.populateRecipes().then(() => {
        if (isFirstTime) {
            createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY)
        }
    })

    // display the 5 recipes and add search btn listener only in homepage
    if (window.location.pathname === '/index.html' || window.location.pathname === '/' || window.location.pathname === '') {
        createRecipeCards(util.NUMBER_OF_RECIPES_TO_DISPLAY)
        let searchBtn = document.getElementById("search");
        searchBtn.addEventListener("click", e => {
            e.preventDefault();
            let searchQuery = document.getElementById("searchQuery").value;
            util.searchLocalRecipes(searchQuery).then(arr => {
                let res = [];
                arr.forEach(recipe => {
                    res.push(recipe["id"]);
                });
                let searchObj = {
                    "data": res,
                    "query": searchQuery,
                    "matchedCount": arr.length
                }
                localStorage.setItem("latestSearch", JSON.stringify(searchObj));
                window.location.href = "/searchpage.html";
            });
        });
    }
    // let searchBtn = document.getElementById("search");
    // searchBtn.addEventListener("click", e => {
    //     e.preventDefault();
    //     let searchQuery = document.getElementById("searchQuery").value;
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
        util.router.navigate(key);
    });
}
