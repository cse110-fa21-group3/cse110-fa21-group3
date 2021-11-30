import * as util from "./API/utilityFunctions.js";

const id = window.location.hash.slice(1);

window.addEventListener("DOMContentLoaded", init);

function init(){
    let eTitle = document.getElementById("recipe-title"); // done
    let eImage = document.getElementById("recipe-image"); // done
    let eTags = document.getElementById("recipe-tags"); // don't have
    let eTime = document.getElementById("recipe-time"); // done
    let eServes = document.getElementById("recipe-serves"); // don't have
    let eDescription = document.getElementById("recipe-description"); // don't have
    let eIngredients = document.getElementById("recipe-ingredients-list"); // done
    let eSteps = document.getElementById("recipe-steps-list"); // done
    let eNutrition = document.getElementById("recipe-nutrition-list"); // done

    // Preferably, we would have a function from the API utils that gets recipe data for us
    let data = localStorage.getItem(id); // get the recipe data (here it's a string)
    data = JSON.parse(data); // parse the string rep of the object to create an object

    // Set data values
    eTitle.innerText = data["title"];
    eImage.setAttribute("src", data["image"]);
    eTime.innerText = data["readyInMinutes"];
 
    // eServes.innerText = data["serves"];
    eDescription.innerHTML = data["summary"];
    
    data["ingredients"].forEach(ing => {
        const ingItem = document.createElement("li");
        ingItem.innerText = ing;
        eIngredients.appendChild(ingItem);
    });

    data["steps"].forEach(step => {
        const stepItem = document.createElement("li");
        stepItem.innerText = step;
        eSteps.appendChild(stepItem);
    });

    data["nutrition"].forEach(fact => {
        const factItem = document.createElement("li");
        factItem.innerText = fact;
        eNutrition.appendChild(factItem);
    });


    let favoriteBtn = document.getElementById("favorite");
    let favArr = util.getFavoriteRecipes();
    if(favArr && favArr.includes(id)){
        //favoriteBtn.innerText = "Unfavorite";
    }else{
        //favoriteBtn.innerText = "Favorite";
    }
    
    favoriteBtn.addEventListener("click", e => {
        favArr = util.getFavoriteRecipes();
        if(favArr && favArr.includes(id)){
            util.removeFavoriteRecipe(id);
            //favoriteBtn.innerText = "Favorite";
        }else{
            util.addFavoriteRecipe(id);
            //favoriteBtn.innerText = "Unfavorite";
        }
    });
}

// changing the color
document.querySelector('#favorite').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('liked');
});

document.getElementById("editRecipe").addEventListener('click', e => {
    window.location.href = "/source/createRecipe.html#"+id;
});
