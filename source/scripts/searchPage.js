import { router } from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", () => {
    let results = localStorage.getItem("latestSearch");
    if(results){
        results = results.split(",");
        results.forEach(id => {
            let recipeCardsSection = document.getElementById("recipeCards");
            let recipeCard = document.createElement("recipe-card");
            let recipeData = JSON.parse(localStorage.getItem(id));
            console.log(recipeData);
            recipeCard.data = recipeData;
            recipeCardsSection.appendChild(recipeCard);
            recipeCard.addEventListener("click", e => {
                router.navigate(id);
            });
        });
    }else{
        alert("No search results in local storage");
        router.navigate("home");
    }
});