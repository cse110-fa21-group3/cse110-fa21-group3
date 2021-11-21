/**
 * Homepage JS file
 */

import { Router } from "./router.js";
import * as util from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", init);

// Create a new Router for handling pages
const router = new Router(() => {
    window.location.href = "/";
});

let createRecipeButton = document.getElementById("create-recipe");
createRecipeButton.addEventListener('click', e => {
    window.location.href = "/source/createRecipe.html";
});

/**
 * Function that runs when the page loads
 */
function init(){
    util.fetchRecipes(10, 0);
    createRecipeCards(10);
}

/**
 * Create recipe cards for an arbitrary amount of recipes
 * 
 * @param {number} N The number of recipes to display
 */
function createRecipeCards(N){ 
    let recipes = {}; // dict of recipes to display on-screen
    
    // add in N recipes to recipes dict display
    // Add until we either reach N or run out of recipes
    let i = 0;
    while(i < N && localStorage.key(i) != null){
        let key = localStorage.key(i);
        let recipe = localStorage.getItem(key);
        recipes[key] = recipe.slice(0, recipe.length);
        i++;
    }

    // Get the recipe cards' section element
    let recipeCardsSection = document.getElementById("recipeCards");

    // Create recipe cards and add page function to router
    Object.keys(recipes).forEach(key => {
        const recipeCard = document.createElement("recipe-card");
        recipeCard.data = JSON.parse(recipes[key]);
        router.addPage(key, () => {
            // Goto this recipe page with recipe id as hash
            window.location.href = "/source/recipePage.html#"+key;
        });
        bindRC(recipeCard, key); // Bind navigation to recipe card
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
        router.navigate(key);
    });
}