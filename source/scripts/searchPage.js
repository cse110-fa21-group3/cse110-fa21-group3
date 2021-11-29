import { router } from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", () => {
    let results = localStorage.getItem("latestSearch");
    let queryDisplay = document.getElementById("queryDisplay");
    let matchedCountText = document.getElementById("matchedCountText");
    if(results){
        results = JSON.parse(results);
        if (results["matchedCount"] === 0) {
            return;
        }
        queryDisplay.innerText = "Showing results for: " + '"' + results["query"] + '"';
        matchedCountText.innerText = results["matchedCount"] + " results found";
        results = results["data"];
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