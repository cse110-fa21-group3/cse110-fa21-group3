// API Key and endpoint
const API_KEY = "d521803115da40baae0a51bf87c54e9a";
const API_ENDPOINT = "https://api.spoonacular.com";
let Json_data = new Object;
let allowedIntolerances = 'dairy, egg, gluten, grain, peanut, seafood, sesame, shellfish, soy, sulfite, tree nut, wheat';
let intolerances = [];
let maxTime = 60;
// These are typically the options we need to perform a request
const options = {
    "credentials": "omit",
    "method": "GET",
    "mode": "cors",
    "headers": {
        "Content-Type": "text/plain"       
    } 
}

function init() {
    var localKeys = Object.keys(localStorage);
    if (!localKeys.length) {
        this.getRecipesByAmount(5);
    }
}

async function setUserPreferences() {
    var inputIntol = window.prompt("Please enter any dietary restrictions such as dairy, gluten, peanuts, etc seperated by commas: ");
    inputIntol = inputIntol.toLowerCase();
    var intolArray = [];
    intolArray = inputIntol.split(',');
    for(let stringIntol of intolArray) {
        if(allowedIntolerances.includes(stringIntol)) {
            intolerances.push(stringIntol);
        }
    }

    var inputTime = window.prompt("Enter the max amount of time you want to spend cooking: ");
    if(inputTime <= 0) {
        console.log("That time you entered is not possible so we decided to default you to 1 hour.")
        return;
    }
    else {
        maxTime = inputTime;
    }
    getRecipesByAmount(5);
    console.log(maxTime, intolerances);
}

/**
 * This function query the API and get a fixed amount of recipes  
 * with offset in the query.
 * @param {number} maxTime - The maximum of the recipes' prep time.
 * @param {number} recipeNumber - The number of recipes to get.
 * @param {number} offset - The number of results to skip.
 * @returns {Promise} 
 */ 
async function getRecipesIntoLocal(intolerances, maxTime, recipe_count, offset){
   let reqUrl = `${API_ENDPOINT}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true&number=${recipe_count}&offset=${offset}&readyReadyTime=${maxTime}&sort="meta-score"`;

   var intolerancesStr = "";
   if(intolerances.length > 0){
        intolerances.forEach(i => intolerancesStr += `,${i}`);
        intolerancesStr = intolerancesStr.slice(1, intolerancesStr.length);
        console.log(intolerancesStr);
        reqUrl += "&intolerances="+intolerancesStr;
   }

   console.log(reqUrl);

   return new Promise((resolve, reject) => {
        fetch(reqUrl, options)
            .then(res => res.json())
            .then(res => {
                //console.log(res["results"]);
                res["results"].forEach(r => {
                    createRecipeObject(r);
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
 * This function takes in what is fetched and from those parameters finds what we need for the recipe and sorts it into an object
 */
async function createRecipeObject(r) {
    let id = r["id"];
    let readyInMinutes = r["readyInMinutes"];
    let title = r["title"];
    let foodImage = r["image"];

    // populating ingredient list
    let ingredients = [];
    let ingredientSearch = "";
    r["missedIngredients"].forEach(ingre => {
        ingredients.push(ingre.original);
        ingredientSearch += ingre.originalName + " ";
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
        "title" : title,
        "image" : foodImage,
        "readyInMinutes" : readyInMinutes,
        "ingredientSearch" : ingredientSearch,
        "ingredients" : ingredients,
        "steps" : steps,
        "nutrition" : nutrition
    }
    localStorage.setItem(r.id, JSON.stringify(recipeObject));
    console.log(JSON.parse(localStorage.getItem(r.id)));
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
        getRecipesIntoLocal(intolerances, maxTime, 5, offset);
        offset += 100
    }

    // getting the remaining amount (< 100 recips)
    if (remain_number > 0) { 
        getRecipesIntoLocal(intolerances, maxTime, remain_number, offset);
        offset += remain_number;
    }
}

/**
 * This function search through the local storage linearly and returns a list of recipes that
 * matches the word in the query
 * @param {string} query - the query used to search the local storage
 * @returns {JSON|Array} - the list of matched recipes
 */ 
async function searchRecipesLocally(query) {
    //get the keys of all recipes in local storage
   var localKeys = Object.keys(localStorage);

   // check to see if local storage is empty, if so then populate local storage
    if (!localKeys.length) {
        this.getRecipesByAmount(5);
    }

   query = query.toLowerCase();
   let recipeList = [];
   // iterate through all recipes and check the title and ingredients for the query
   for(let recipeId of localKeys) {
       let recipe = JSON.parse(localStorage.getItem(recipeId));
       let recipeTitle = recipe.title.toLowerCase();
       let recipeIngredients = recipe.ingredientSearch.toLowerCase();
       recipeIngredients = recipeIngredients.toLowerCase();
       // if the query is in the recipes then add it to an array
       if(recipeTitle.includes(query)) {
            recipeList.push(recipe);
       }else if (recipeIngredients.includes(query)) {
            recipeList.push(recipe);
       }
   }
   console.log(recipeList);
   // return a populated array of recipes relating to the query
   return recipeList;
}