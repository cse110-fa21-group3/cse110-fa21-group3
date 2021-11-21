// API Key and endpoint
const API_KEY = "6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f";
const API_ENDPOINT = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com";

// These are typically the options we need to perform a request
const options = {
    "credentials": "omit",
    "method": "GET",
    "mode": "cors",
    "headers": {
        "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "x-rapidapi-key": "6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f"
    } 
}

const DEFAULT_RECIPE_NUMBER = 5;
const DEFAULT_MAX_TIME = 60;
// list of intolerances filter offered by the Spoonacular API
const allowedIntolerances = [
    "dairy", 
    "egg", 
    "gluten", 
    "grain", 
    "peanut", 
    "seafood", 
    "sesame", 
    "shellfish", 
    "soy", 
    "sulfite", 
    "tree nut", 
    "wheat"
];
// list of user Intolerances
let intolerances = [];
// max for recipes prep time
let maxTime = DEFAULT_MAX_TIME;


// just a tesing function
function init() {
    loadUserData();
    console.log(intolerances);
    console.log(maxTime);
}

/**
 * This function updates the intolerances of the user which is used when 
 * fetching recipes from the API
 * @param {string} inputIntol - A string of the intolerances.
 */
function setIntolerances(inputIntol) {
    if (inputIntol == '') {
        updateUserData("intolerances", []);
        return;
    }

    // format the intolerance string by pattern matching
    let inputArray = inputIntol.toLowerCase().replace(/\s/g, '').split(",");
    let intols = [];
    for(let intol of inputArray) {

        // if the entries matches any of the item in the allowedIntolerances
        // array, then add it to userData.
        if(allowedIntolerances.includes(intol)) {
            intols.push(intol);
        }
    }

    // Update the userData in localStorage
    updateUserData("intolerances", intols);
}

/**
 * This function updates the maxTime of the recipes which is used when fetching
 * from the API
 * @param {string} time - A string containing the maxTime.
 */
function setMaxTime(time) {
    if (time == ''){
        updateUserData("maxTime", DEFAULT_MAX_TIME);
        return;
    }
    maxTime = parseInt(time);

    // Update the userData in localStorage
    updateUserData("maxTime", maxTime);
}

/**
 * This function loads the userData stored in localStorage and
 * sets the `intolerances` variable and the `maxTime` variable
 */ 
function loadUserData() {
    let data = localStorage.getItem("userData");
    if (data) {
        data = JSON.parse(data);
    }else {
        intolerances = [];
        maxTime = DEFAULT_MAX_TIME;
        return;
    }

    intolerances = data["intolerances"] ? data["intolerances"] : [];
    maxTime = data["maxTime"] ? data["maxTime"] : DEFAULT_MAX_TIME;
}

function getFavoriteRecipes() {
    let userData = JSON.parse(localStorage.getItem("userData"));
    let favoriteRecipes = [];
    try {
        favoriteRecipes = userData["favorites"];
    } catch(err) {
    }
    return favoriteRecipes;
}

function addFavoriteRecipes(id) {
    // get the favorites array and add the favorited recipe to the array
    var favArr = getFavoriteRecipes();
    favArr.push(`${id}`);
    updateUserData("favorites", favArr);
    
    // change favorite property in the recipe object
    let recipe = JSON.parse(localStorage.getItem((`${id}`)));
    recipe['favorite'] = true;
    localStorage.setItem(`${id}`, JSON.stringify(recipe));
}

function removeFavoriteRecipe(id) {
    let favArr = getFavoriteRecipes();
    let removed = [];

    // change favorite property in the recipe object
    let recipe = JSON.parse(localStorage.getItem((`${id}`)));
    recipe['favorite'] = false;
    localStorage.setItem(`${id}`, JSON.stringify(recipe));
    
    console.log(favArr);
    for (let recipeID of favArr) {
        if(recipeID != id) {
            removed.push(recipeID);
        }
    }
    updateUserData("favorites", removed);
}

/**
 * This function updates the userData stored in localStorage using
 * the Key-Value pair passed in.
 * @param {string} key - The key of the user data being stored.
 * @param {any} value - The data being stored.
 */ 
function updateUserData(key, value) {
    let data = localStorage.getItem("userData");
    if (data) {
        data = JSON.parse(data);
    }else {
        data = {};
    }
    data[key] = value;
    localStorage.setItem("userData", JSON.stringify(data));
    console.log(JSON.parse(localStorage.getItem("userData")));
}

/**
 * This function query the API multiple times with the fetchRecipes(...) function
 * to get a recipe dump
 * @param {number} total_count - The total number of recipes to get from API.
 */ 
export async function populateRecipes(total_count) {
    let offset = 0;
    // get recipes by 100s
    let repeat_times = Math.round(total_count / 100);
    // get marginal recipes
    let remain_number = total_count % 100;

    // repeat getting 100 recipes at a time
    // Because that's tha max amount the API returns per call
    for(let i = 0; i < repeat_times; i++) {
        fetchRecipes(100, offset);
        offset += 100;
    }

    // getting the remaining amount (< 100 recips)
    if (remain_number > 0) { 
        fetchRecipes(remain_number, offset);
        offset += remain_number;
    }
}

/**
 * This function search through the local storage linearly and returns a list of recipes that
 * matches the word in the query
 * @param {string} query - the query used to search the local storage
 * @returns {JSON|Array} - the list of matched recipes
 */ 
export async function searchLocalRecipes(query) { 
    let recipeList = [];
    query = query.toLowerCase();
    let localRecipes = getLocalStorageRecipes();
 
    if (!localRecipes) {
        populateRecipes(DEFAULT_RECIPE_NUMBER);
        localRecipes = getLocalStorageRecipes();
    }
    
    var endQuery = [];
    // if query includes commas 
    if(query.includes(',')) {
        //replace commas by space
        query = query.replace(/,/g, ' ');
        
    }
    // if there are spaces 
    let queryTemp = query.split(' ');
    for(let queryWord of queryTemp) {
        if(queryWord != '') {
            endQuery.push(queryWord);
        }
    }
    
    // iterate through all recipes and check the title and ingredients for the query
    for(let recipe of localRecipes) {
        let recipeTitle = recipe.title.toLowerCase();
        let recipeIngredients = recipe.ingredientSearch.toLowerCase();
        // if the query is in the recipes then add it to an array
        for(let queryElement of endQuery) {
            if(recipeTitle.includes(queryElement)) {
                recipeList.push(recipe);
                break;
            }
            else if (recipeIngredients.includes(queryElement)) {
                recipeList.push(recipe);
                break;
            }
        }
    
    }
    console.log(recipeList);
    // return a populated array of recipes relating to the query
    return recipeList;
 }


/**
 * This function queries the API and gets a fixed amount of recipes  
 * with offset in the query.
 * @param {number} recipe_count - The number of recipes to get.
 * @param {number} offset - The number of results to skip.
 * @returns {Promise} 
 */ 
export async function fetchRecipes(recipe_count, offset){
    loadUserData();
    let reqUrl = `${API_ENDPOINT}/recipes/complexSearch?apiKey=${API_KEY}&addRecipeNutrition=true&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true&number=${recipe_count}&offset=${offset}&readyReadyTime=${maxTime}`;

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
    let favorite = false;

    // populating ingredient list
    let ingredients = [];
    let ingredientSearch = "";
    r["missedIngredients"].forEach(ingre => {
        ingredients.push(ingre.original);
        ingredientSearch += ingre.name + " ";
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
        "nutrition" : nutrition,
        "favorite" : favorite
    }
    setLocalStorageItem(r.id, recipeObject);
}

/**
 * This function get all recipes stored inside the localStorage and return
 * them in a list
 * @returns {JSON|Array} - an array of recipes JSON Objects in the localStorage.
 */ 
function getLocalStorageRecipes() {
    //get the keys of all recipes in local storage
    var localKeys = Object.keys(localStorage);

    let recipeList = [];

    // check to see if local storage is empty, if so then populate local storage
    if (!localKeys) {
        return recipeList;
    }

    for(let key of localKeys) {
        if (key != "userData") {
            recipeList.push(JSON.parse(localStorage.getItem(key)));
        }
    }
    return recipeList;
}

/**
 * This function adds the passed in recipe JSON object into local storage
 * @param {number} id - id for the local storage item
 * @param {Object} recipeObject - a JSON recipe object
 */ 
export async function setLocalStorageItem(id, recipeObject) {
    localStorage.setItem(id, JSON.stringify(recipeObject));
}