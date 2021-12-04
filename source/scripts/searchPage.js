import { router, searchLocalRecipes } from "./API/utilityFunctions.js";

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById('favContainer').addEventListener('click', e => {
        window.location.href = "/searchpage.html#favorites";
        window.location.reload();
    });

    let searchBtn = document.getElementById("search-icon");
    searchBtn.addEventListener("click", e => {
        e.preventDefault();
        let searchQuery = document.getElementById("searchBar").value;
        searchLocalRecipes(searchQuery).then(arr => {
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
            window.location.href = "/searchpage.html";
        });
    });

    let results = localStorage.getItem("latestSearch");
    let queryDisplay = document.getElementById("queryDisplay");
    let matchedCountText = document.getElementById("matchedCountText");

    if(window.location.hash === "#favorites"){
        results = JSON.parse(localStorage.getItem("userData")).favorites;
        queryDisplay.innerText = "Showing Favorites"
        matchedCountText.innerText = results.length;
    }else if(results){
        results = JSON.parse(results);

        if (results["matchedCount"] === 0) {
            alert("No results found");
            router.navigate("home");
            return;
        }
        queryDisplay.innerText = "Showing results for: " + '"' + results["query"] + '"';
        matchedCountText.innerText = results["matchedCount"] + " results found";
        results = results["data"];
    }
    
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
});