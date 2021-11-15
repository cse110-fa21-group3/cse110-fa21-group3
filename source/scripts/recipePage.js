const id = window.location.hash.slice(1);
console.log(id);

function init(){
    let eTitle = document.getElementById("recipe-title");
    let eImage = document.getElementById("recipe-image");
    let eTags = document.getElementById("recipe-tags");
    let eTime = document.getElementById("recipe-time");
    let eServes = document.getElementById("recipe-serves");
    let eDescription = document.getElementById("recipe-description");
    let eIngredients = document.getElementById("recipe-ingredients-list");
    let eSteps = document.getElementById("recipe-steps-list");
    let eNutrition = document.getElementById("recipe-nutrition-list");

    // Nathan and Martin thing
    let data = localStorage.getItem(id); // get the recipe data (here it's a string)
    data = JSON.parse(data); // parse the string rep of the object to create an object

    // Set data values
    eTitle.innerText = data["title"];
    // eImage.setAttribute("src", data["image"]);
    // eTags.innerText = data["tags"].toString(); // Expecting an array
    eTime.innerText = data["time"];
    // eServes.innerText = data["serves"];
    // eDescription.innerText = data["description"];
    
    // data["ingredients"].array.forEach(ing => {
    //     const ingItem = document.createElement("li");
    //     ingItem.innerText = ing;
    //     eIngredients.appendChild(ingItem);
    // });

    // data["steps"].array.forEach(step => {
    //     const stepItem = document.createElement("li");
    //     stepItem.innerText = step;
    //     eSteps.appendChild(stepItem);
    // });

    // data["nutrition"].array.forEach(fact => {
    //     const factItem = document.createElement("li");
    //     factItem.innerText = fact;
    //     eNutrition.appendChild(factItem);
    // });
}