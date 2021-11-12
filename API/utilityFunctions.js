// API Key and endpoint
const API_KEY = "d521803115da40baae0a51bf87c54e9a";
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
