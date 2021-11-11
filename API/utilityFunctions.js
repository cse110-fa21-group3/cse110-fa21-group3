// API Key and endpoint
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

async function searchRecipes(query, intolerances, maxTime) {
  // First we get the Url for the spoonacular api to access the api recipes
 let reqUrl = API_ENDPOINT +  "/recipes/complexSearch?apiKey=" + API_KEY +
        "&query=" + query + "&instructionsRequired=true&number=5&addRecipeNutrition=true";
  // we then get and store the intolerances available in the spoonacular api into a string
  var intolerancesStr = "";
   if(intolerances.length > 0){
        intolerances.forEach(i => intolerancesStr += `,${i}`);
        intolerancesStr = intolerancesStr.slice(1, intolerancesStr.length);
        console.log(intolerancesStr);
        reqUrl += "&intolerances="+intolerancesStr;
   }
    
   reqUrl += "&maxReadyTime=" + maxTime;
  
  

   console.log(reqUrl);
  
  
  
}
