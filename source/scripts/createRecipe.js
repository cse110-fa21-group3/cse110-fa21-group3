import * as util from "./API/utilityFunctions.js";

let addIng = document.getElementById("addIng");
let addStep = document.getElementById("addStep");
let addNutrition = document.getElementById("addNutrition");

let removeIng = document.getElementById("removeIng");
let removeStep = document.getElementById("removeStep");
let removeNutrition = document.getElementById("removeNutrition");

let createRecipe = document.getElementById("createBtn");

addIng.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeIngredients");
    let newElement = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldInput = document.createElement("input");

    fieldSetLabel.innerText = "Ingredient: ";
    fieldInput.name = "ingredients";
    newElement.appendChild(fieldSetLabel);
    newElement.appendChild(fieldInput);
    elementContainer.appendChild(newElement);

    if(removeIng.style.display == "none"){
        removeIng.style.display = "block";
    }
});

addStep.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeSteps");
    let newElement = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldInput = document.createElement("input");

    fieldSetLabel.innerText = "Step: ";
    fieldInput.name = "steps";
    newElement.appendChild(fieldSetLabel);
    newElement.appendChild(fieldInput);
    elementContainer.appendChild(newElement);

    if(removeStep.style.display == "none"){
        removeStep.style.display = "block";
    }
});

addNutrition.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeNutrition");
    let newElement = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldInput = document.createElement("input");

    fieldSetLabel.innerText = "Nutrition: ";
    fieldInput.name = "nutrition";
    newElement.appendChild(fieldSetLabel);
    newElement.appendChild(fieldInput);
    elementContainer.appendChild(newElement);

    if(removeNutrition.style.display == "none"){
        removeNutrition.style.display = "block";
    }
});

removeIng.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeIngredients");
    let lastChild = elementContainer.lastChild;
    elementContainer.removeChild(lastChild);

    if(elementContainer.children.length == 3){
        removeIng.style.display = "none";
    }
});

removeStep.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeSteps");
    let lastChild = elementContainer.lastChild;
    elementContainer.removeChild(lastChild);

    if(elementContainer.children.length == 3){
        removeStep.style.display = "none";
    }
});

removeNutrition.addEventListener("click", e => {
    let elementContainer = document.getElementById("recipeNutrition");
    let lastChild = elementContainer.lastChild;
    elementContainer.removeChild(lastChild);

    if(elementContainer.children.length == 3){
        removeNutrition.style.display = "none";
    }
});

createRecipe.addEventListener("click", e => {
    e.preventDefault();
    let formRes = {
        "id": "ucr_",
        "image": "../../admin/branding/logo3_231x231.jpg",
        "favorite": true,
        "readyInMinutes": 0,
        "title": "",
        "ingredients": [],
        "ingredientSearch": "",
        "steps": [],
        "nutrition": []
    };
    let formData = document.getElementById("recipeForm");
    let formObj = new FormData(formData);
    let formKeys = Array.from(formObj.keys());

    formKeys.forEach(key => {
        let res = formObj.getAll(key);
        console.log(res);
        if(key == "steps" || key == "nutrition" || key == "ingredients"){
            formRes[key] = formObj.getAll(key);
        }else{
            formRes[key] = res[0];
        }
    });

    formRes["ingredients"].forEach(ing => {
        formRes["ingredientSearch"] += ing;
    });
    formRes["id"] += formRes["title"].replaceAll(" ", "");
    util.setLocalStorageItem(formRes["id"], formRes);
    util.addFavoriteRecipe(formRes["id"]);
    window.location.href = "/source/homepage.html";
});