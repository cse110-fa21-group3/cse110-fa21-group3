// API Key and endpoint
const API_KEY = '6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f'
const API_ENDPOINT = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'

// These are typically the options we need to perform a request
const options = {
  credentials: 'omit',
  method: 'GET',
  mode: 'cors',
  headers: {
    'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'x-rapidapi-key': '6c38415312msh8fd80bab0f17271p1dcefajsn83892f0c646f'
  }
}

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

/**
 * Web Scrapping method for additional functionality for creating recipes
 * @param {string} url - the url inputted to scrap 
 * @return {JSON} the json data of that website
 */
 function webScrapper(url) {
    let urlToExtract = `${API_ENDPOINT}/recipes/extract?apiKey=${API_KEY}&url=${url}`
    return new Promise((resolve, reject) => {
      fetch(urlToExtract, options)
        .then(res => {res.json(); console.log(res)})
        .then(async res => {
          await createRecipeObject(res)
          resolve(true)
        })
        .catch(error => {
          console.log(error)
          reject('error')
        })
    })
  }

/**
 * Method to remove the links in summary of the recipes which are unneccesary
 * @returns {String} - a String with all the link texts removed.
 */
  function removeSummaryLinks(summary) {
    const linkTerm = '<a href=', linkEnd = '</a>'
    if (!summary) { return '' }
    while (summary.includes(linkTerm) && summary.includes(linkEnd) && summary.indexOf(linkTerm) < summary.indexOf(linkEnd)) {
      let indexOfFirstLink = summary.indexOf(linkTerm)
      let indexOfEndLink = summary.indexOf(linkEnd)
  
      let firstHalf = summary.substring(0, indexOfFirstLink)
      let lastPeriodIndex = firstHalf.lastIndexOf('.')
      firstHalf = (lastPeriodIndex >= 0) ? firstHalf.substring(0, lastPeriodIndex+1) : firstHalf
  
      let secondHalf = summary.substring(indexOfEndLink+4)
  
      let periodIndex, urlPostfixIndex
      do {
        periodIndex = secondHalf.indexOf('.')
        urlPostfixIndex = secondHalf.indexOf('.com')
        if (periodIndex < 0) { break }
        if (periodIndex >= secondHalf.length-1) { 
          secondHalf = ''
          break
        }
        secondHalf = secondHalf.substring(periodIndex+1)
      } while (periodIndex === urlPostfixIndex)
  
      summary = firstHalf + secondHalf
    }
    return summary
  }

/**
 * This function adds the passed in recipe JSON object into local storage
 * @param {number} id - id for the local storage item
 * @param {Object} recipeObject - a JSON recipe object
 */
function setLocalStorageItem (id, recipeObject) {
    localStorage.setItem(id, JSON.stringify(recipeObject))
  }


/**
 * This function takes in what is fetched and from those parameters finds what we need for the recipe and sorts it into an object
 * @param {JSON} r - recipe json Object
 */
 async function createRecipeObject (r) {
    const id = r.id
    const readyInMinutes = r.readyInMinutes
    const title = r.title
    const foodImage = r.image
    const favorite = false
  
    const summary = removeSummaryLinks(r.summary)
    const size = r.servings
  
    // populating ingredient list
    const ingredients = []
    let ingredientSearch = ''
    if (r.missedIngredients) {
      r.missedIngredients.forEach(ingre => {
        ingredients.push(ingre.original)
        ingredientSearch += ingre.name + ' '
      })
    }else if (r.extendedIngredients) {
      r.extendedIngredients.forEach(ingre => {
        ingredients.push(ingre.original)
        ingredientSearch += ingre.name + ' '
      })
    }
  
    // populating nutrition list
    const nutrition = []
    for (let nutr_index = 0; nutr_index < 9; nutr_index++) {
      const nutr_title = r.nutrition.nutrients[nutr_index].title
      const nutr_amount = r.nutrition.nutrients[nutr_index].amount
      const nutr_unit = r.nutrition.nutrients[nutr_index].unit
      nutrition.push(nutr_title + ': ' + nutr_amount + ' ' + nutr_unit)
    }
  
    const steps = []
    r.analyzedInstructions[0].steps.forEach(recipeStep => {
      steps.push(recipeStep.step)
    })
  
    // Create a JSON Object to store the data
    // in the format we specified
    const recipeObject = {
      id: id,
      title: title,
      image: foodImage,
      readyInMinutes: readyInMinutes,
      ingredientSearch: ingredientSearch,
      ingredients: ingredients,
      steps: steps,
      nutrition: nutrition,
      favorite: favorite,
      summary: summary,
      servingSize: size
    }
    setLocalStorageItem(r.id, recipeObject)
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


// /**
//  * Web Scrapping method for additional functionality for creating recipes
//  * @param {string} url - the url inputted to scrap 
//  * @return {JSON} the json data of that website
//  */
// async function webScrapper(url) {
//     let urlToExtract = `${API_ENDPOINT}/recipes/extract?apiKey=${API_KEY}&url=${url}&includeNutrition=true`
//     console.log(urlToExtract)
//     return new Promise((resolve, reject) => {
//       fetch(urlToExtract, options)
//         .then(res => res.json())
//         .then(res => {
//           console.log(res)
//           //localStorage.setItem('randomKey', res )
//           resolve(true)
//           // create local storage items
//           /**
//            * pop
//            */
//           /*
//           res.results.forEach(async r => {
//             createRecipeObject(r).then(() => {
//               resolve(true)
//             })
//           })*/
//         })
//         .catch(error => {
//           console.log(error)
//           reject('error')
//         })
//     })
//   }
