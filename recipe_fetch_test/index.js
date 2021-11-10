const API_KEY = "2476d65f388749eb9561ad4b9ad777ca";
const API_ENDPOINT = "https://api.spoonacular.com";

// These are typically the options we need to perform a request
const options = {
    "credentials": "omit",
    "method": "GET",
    "mode": "cors",
    "headers": {
        "Content-Type": "text/plain"       
    } 
};

async function searchRecipes(query, intolerances){
    /* 
    * What do we need:
    *   - intolerances
    *   - instructionsRequired
    *   - addRecipeInformation (?)
    *   - addRecipeNutrition (?)
    *   - number (max results)
    *   - all the min/max parameters (?)
    *   - type (?)
    *   - 
    */
   let reqUrl = API_ENDPOINT+
        "/recipes/complexSearch?apiKey="+
        API_KEY+
        "&query="+
        query+
        "&instructionsRequired=true&number=5&addRecipeNutrition=true";

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
                console.log(res["results"]);
                res["results"].forEach(r => {
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

// async function fetchRecipe(){
//     return new Promise((resolve, reject) => {
//         fetch(API_ENDPOINT, options)
//             .then(res => res.json())
//             .then(res => {
//                 // console.log(JSON.stringify(r, null, 2))
//                 res["results"].forEach(r => {
//                     let recipeTag = document.createElement("pre");
//                     recipeTag.innerHTML = JSON.stringify(r, null, 2);
//                     document.getElementById("disp").appendChild(recipeTag);
//                 });
//                 resolve(true);
//             })
//             .catch(error => {
//                 console.log(error);
//                 reject(false);
//             });
//     });
// }