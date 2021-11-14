// API Key and endpoint
const API_KEY = "2476d65f388749eb9561ad4b9ad777ca";
const API_ENDPOINT = "https://api.spoonacular.com";
let Json_data = new Object;

// These are typically the options we need to perform a request
const options = {
    "credentials": "omit",
    "method": "GET",
    "mode": "cors",
    "headers": {
        "Content-Type": "text/plain"       
    } 
};

/*
 * This function query the API with options in the request url
 * to obtain a json object with recipes
*/
async function searchRecipes(query, intolerances, infoMode) {
  // First we get the Url for the spoonacular api to access the api recipes
    let reqUrl = API_ENDPOINT +  "/recipes/complexSearch?apiKey=" + API_KEY +
        "&query=" + query + "&number=1";

    var intolerancesStr = "";
    if(intolerances.length > 0){
        intolerances.forEach(i => intolerancesStr += `,${i}`);
        intolerancesStr = intolerancesStr.slice(1, intolerancesStr.length);
        reqUrl += "&intolerances="+intolerancesStr;
    }

    // Obtain more information of the recipes with this option: "&addRecipeInformation=true"
    let infoQuery = "";
    if (infoMode == "info") {
        infoQuery = "&addRecipeInformation=true"
    }

    reqUrl += infoQuery;
    console.log(reqUrl);

        return new Promise((resolve, reject) => {
            fetch(reqUrl, options)
                .then(res => res.json())
                .then(res => {
                    console.log("Search Result:")
                    console.log(res);

                    // cleaning screen
                    let display = document.getElementById("disp");
                    while (display.firstChild) {
                        display.removeChild(display.firstChild);
                    }
                    res["results"].forEach(r => {
                        let recipeTag = document.createElement("pre");
                        recipeTag.innerHTML = JSON.stringify(r, null, 2);
                        display.appendChild(recipeTag);
                        display.appendChild(document.createElement("hr"));
                    });
                    resolve(true);
                })
                .catch(error => {
                    console.log(error);
                    reject(false);
                });
       });    
}

/* 
 * This function get random recipes from the API
 * Only has parameter `number` 
 * Returns a Json object with recipes
 */
async function getRandomRecipes(number=5) {
    // setting request url
    let reqUrl = API_ENDPOINT +  "/recipes/random?apiKey=" + API_KEY +"&number=" + number;

    return new Promise((resolve, reject) => {
        fetch(reqUrl, options)
            .then(res => res.json())
            .then(res => {
                console.log("Random Result:")
                console.log(res["recipes"]);
                res["recipes"].forEach(r => {
                    Json_data[r.id] = r
                });
                console.log(Json_data)

                // cleaning screen
                let display = document.getElementById("disp");
                    while (display.firstChild) {
                        display.removeChild(display.firstChild);
                    }

                // Note that the array is in the recipes property
                res["recipes"].forEach(r => {
                    let recipeTag = document.createElement("pre");
                    recipeTag.innerHTML = JSON.stringify(r, null, 2);
                    document.getElementById("disp").appendChild(recipeTag);
                    document.getElementById("disp").appendChild(document.createElement("hr"));
                });
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
   });
}

// Generate a recipe card image with a recipe id 
async function getRecipeCard(id) {
    let reqUrl = API_ENDPOINT +  "/recipes/" + id + "/card?apiKey=" + API_KEY;
    return new Promise((resolve, reject) => {
        fetch(reqUrl, options)
            .then(res => res.json())
            .then(res => {
                console.log("Card Result:")
                console.log(res);

                // cleaning screen
                let display = document.getElementById("disp");
                    while (display.firstChild) {
                        display.removeChild(display.firstChild);
                    }
                    let recipeCard = document.createElement("img");
                    recipeCard.setAttribute("src", res.url)
                    recipeCard.setAttribute("style", "max-width:600px")
                    document.getElementById("disp").appendChild(recipeCard);
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
   });
}

/**
 * This function query the API and get a fixed amount of recipes  
 * with offset in the query.
 * @param {number} maxTime - The maximum of the recipes' prep time.
 * @param {number} recipeNumber - The number of recipes to get.
 * @param {number} offset - The number of results to skip.
 * @returns {Promise} 
 */ 
async function getRecipes(maxTime, recipe_count, offset){
   let reqUrl = `${API_ENDPOINT}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true&number=${recipe_count}&offset=${offset}&readyReadyTime=${maxTime}&sort="meta-score"`;

   console.log(reqUrl);

   return new Promise((resolve, reject) => {
        fetch(reqUrl, options)
            .then(res => res.json())
            .then(res => {
                console.log(res["results"]);
                res["results"].forEach(r => {
                
                    let id = r["id"];
                    let readyInMinutes = r["readyInMinutes"];
                    let title = r["title"];
                    let foodImage = r["image"];

                    // populating ingredient list
                    let ingredients = [];
                    r["missedIngredients"].forEach(ingre => {
                        ingredients.push(ingre.original);
                    })

                    // populating nutrition list
                    let nutrition = [];
                    for (let nutr_index = 0; nutr_index < 9; nutr_index++) {
                        let nutr_title = r["nutrition"]["nutrients"][nutr_index].title;
                        let nutr_amount = r["nutrition"]["nutrients"][nutr_index].amount;
                        let nutr_unit = r["nutrition"]["nutrients"][nutr_index].unit;
                        nutrition.push(nutr_title + ": " + nutr_amount + " " + nutr_unit);
                    }

                    // TODO: Optimize the steps array, now it has ingredients inside,
                    //       which we don't need 
                    let steps = [];
                    r["analyzedInstructions"][0].steps.forEach(recipeStep => {
                        steps.push(recipeStep["step"]);
                    })
                    //console.log(steps);

                    // Create a JSON Object to store the data 
                    // in the format we specified
                    let recipeObject = {
                        "id" : id,
                        "ingredients" : ingredients,
                        "steps" : steps,
                        "title" : title,
                        "readyInMinutes" : readyInMinutes,
                        "image" : foodImage,
                        "nutrition" : nutrition
                    }
                    localStorage.setItem(r.id, JSON.stringify(recipeObject));
                    console.log(JSON.parse(localStorage.getItem(r.id)));
                });
                resolve(true);
            })
            .catch(error => {
                console.log(error);
                reject(false);
            });
   });
}

/**
 * This function query the API multiple times using getRecipes(maxTime, recipe_count, offset)
 * to get a recipe dump
 * @param {number} recipe_total - The total number of recipes to get from API.
 * 
 */ 
async function getRecipesByAmount(recipe_total) {
    let offset = 0;
    let repeat_times = Math.round(recipe_total / 100);
    let remain_number = recipe_total % 100;

    // repeat getting 100 recipes at a time
    // Because that's tha max amount the API returns per call
    for(let i = 0; i < repeat_times; i++) {
        getRecipes(60, 100, offset);
        offset += 100
    }

    // getting the remaining amount (< 100 recips)
    if (remain_number > 0) { 
        getRecipes(60, remain_number, offset);
        offset += remain_number;
    }
}