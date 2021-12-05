import * as util from "./API/utilityFunctions.js";

let addIng = document.getElementById("addIng");
let addStep = document.getElementById("addStep");
let addNutrition = document.getElementById("addNutrition");

let createRecipe = document.getElementById("createBtn");
let cancelBtn = document.getElementById("cancelBtn");

window.addEventListener("DOMContentLoaded", e => {
    if(window.location.hash){
        let id = window.location.hash.slice(1);
        let recipeData = JSON.parse(localStorage.getItem(id));
        populateRecipeForm(recipeData);
        createRecipe.innerText = "Update";
    }
});

addIng.addEventListener("click", e => {
    let elementContainer = document.querySelectorAll(".ingredientContainer");
    let elementContainerLength = elementContainer.length;
    let fieldSet = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldTextArea = document.createElement("input");
    let deleteBtn = document.createElement("button");
    
    deleteBtn.type = "button";
    deleteBtn.classList.add("removeBtn");
    let removeIcon = document.createElement("img");
    removeIcon.src = "./source/image/icons8-delete.svg";
    removeIcon.style.width = "30px";
    deleteBtn.appendChild(removeIcon);
    deleteBtn.addEventListener('click', removeItem);

    fieldSetLabel.innerText = "Ingredient: ";

    fieldTextArea.name = "ingredients";
    fieldTextArea.classList.add("ingName");
    fieldTextArea.type = 'text';
    // fieldTextArea.cols = "30";
    // fieldTextArea.rows = "2";

    fieldSet.classList.add("ingredientContainer");
    fieldSet.appendChild(fieldSetLabel);
    fieldSet.appendChild(fieldTextArea);
    fieldSet.appendChild(deleteBtn);

    elementContainer[elementContainerLength-1].after(fieldSet);
});

addStep.addEventListener("click", e => {
    let elementContainer = document.querySelectorAll(".stepsContainer");
    let elementContainerLength = elementContainer.length;
    let fieldSet = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldTextArea = document.createElement("input");
    let deleteBtn = document.createElement("button");
    
    deleteBtn.type = "button";
    deleteBtn.classList.add("removeBtn");
    let removeIcon = document.createElement("img");
    removeIcon.src = "./source/image/icons8-delete.svg";
    removeIcon.style.width = "30px";
    deleteBtn.appendChild(removeIcon);
    deleteBtn.addEventListener('click', removeItem);

    fieldSetLabel.innerText = "Step: ";
    
    fieldTextArea.name = "steps";
    fieldTextArea.classList.add("stepName");
    fieldTextArea.type = 'text';
    // fieldTextArea.cols = "30";
    // fieldTextArea.rows = "2";
    
    fieldSet.classList.add("stepsContainer");
    fieldSet.appendChild(fieldSetLabel);
    fieldSet.appendChild(fieldTextArea);
    fieldSet.appendChild(deleteBtn);
    
    elementContainer[elementContainerLength-1].after(fieldSet); 
});

addNutrition.addEventListener("click", e => {
    let elementContainer = document.querySelectorAll(".nutritionContainer");
    let elementContainerLength = elementContainer.length;
    let fieldSet = document.createElement("fieldset");
    let fieldSetLabel = document.createElement("label");
    let fieldTextArea = document.createElement("input");
    let deleteBtn = document.createElement("button");
    
    deleteBtn.type = "button";
    deleteBtn.classList.add("removeBtn");
    let removeIcon = document.createElement("img");
    removeIcon.src = "./source/image/icons8-delete.svg";
    removeIcon.style.width = "30px";
    deleteBtn.appendChild(removeIcon);
    deleteBtn.addEventListener('click', removeItem);

    fieldSetLabel.innerText = "Nutrition: ";
    
    fieldTextArea.name = "nutrition";
    fieldTextArea.classList.add("nutrName");
    fieldTextArea.type = 'text';
    // fieldTextArea.cols = "30";
    // fieldTextArea.rows = "2";
    
    fieldSet.classList.add("nutritionContainer");
    fieldSet.appendChild(fieldSetLabel);
    fieldSet.appendChild(fieldTextArea);
    fieldSet.appendChild(deleteBtn);
    
    elementContainer[elementContainerLength-1].after(fieldSet);
});

function removeItem(e){
    let i = e.path[0].tagName === "IMG" ? 0 : 1;
    let parentContainer = e.path[3-i];
    let fieldSet = e.path[2-i];
    parentContainer.removeChild(fieldSet);
}

createRecipe.addEventListener("click", e => {
    e.preventDefault();
    let formRes = {
        "id": "",
        "image": "../../admin/branding/logo3_231x231.jpg",
        "favorite": true,
        "readyInMinutes": 0,
        "title": "",
        "summary": "",
        "ingredients": [],
        "ingredientSearch": "",
        "steps": [],
        "nutrition": []
    };
    let formData = document.getElementById("recipe-form");
    let formObj = new FormData(formData);
    let formKeys = Array.from(formObj.keys());
    let hash = window.location.hash;

    if(hash){
        let currRecipe = JSON.parse(localStorage.getItem(hash.slice(1)));
        if(hash.slice(1,4) === "ucr"){
            let title = formObj.get("title");
            if(title !== currRecipe.title){
                localStorage.removeItem(hash.slice(1));
            }
            formRes["id"] = "ucr_" + title.replaceAll(" ", "");
        }else{
            formRes["id"] = currRecipe.id;
            formRes["image"] = currRecipe.image;
            formRes["favorite"] = false;
        }
    }else{
        let title = formObj.get("title");
        formRes["id"] = "ucr_" + title.replaceAll(" ", "");
        util.addFavoriteRecipe(formRes["id"]);
    }

    formKeys.forEach(key => {
        let res = formObj.getAll(key);
        if(key == "steps" || key === "nutrition" || key == "ingredients"){
            formRes[key] = formObj.getAll(key);
        }else if(key === "recipeDesc"){
            formRes['summary'] = res[0];
        }else{
            formRes[key] = res[0];
        }
    });

    formRes["ingredients"].forEach(ing => {
        formRes["ingredientSearch"] += ing;
    });
    
    util.setLocalStorageItem(formRes["id"], formRes);
    window.location.href = "/index.html";
});

cancelBtn.addEventListener('click', e => {
    window.location.href = "/index.html";
});

function populateRecipeForm(recipeData){
    document.getElementById("recipe-name").value = recipeData.title;
    document.getElementById("recipe-time").value = recipeData.readyInMinutes;
    document.getElementById("recipe-desc").value = recipeData.summary;
    
    // Ingredients fill-in
    let numIng = recipeData.ingredients.length;
    for(let i = 0; i < numIng-1; i++){
        addIng.click();
    }
    let ingInputs = document.getElementsByClassName("ing-name");
    for(let i = 0; i < numIng; i++){
        ingInputs[i].value = recipeData.ingredients[i];
    }

    // Steps fill-in
    let numSteps = recipeData.steps.length;
    for(let i = 0; i < numSteps-1; i++){
        addStep.click();
    }
    let stepInputs = document.getElementsByClassName("step-name");
    for(let i = 0; i < numSteps; i++){
        stepInputs[i].value = recipeData.steps[i];
    }

    // Nutrition fill-in
    let numNutrients = recipeData.nutrition.length;
    for(let i = 0; i < numNutrients-1; i++){
        addNutrition.click();
    }
    let nutritionInputs = document.getElementsByClassName("nutr-name");
    for(let i = 0; i < numNutrients; i++){
        nutritionInputs[i].value = recipeData.nutrition[i];
    }
}