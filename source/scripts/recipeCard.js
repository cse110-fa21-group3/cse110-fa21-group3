// RECIPE TILES

class RecipeCard extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(data){
        if(!data) return;
        this.json = data;

        const recipeCard = document.createElement("article");
        const recipeTitle = document.createElement("p");
        // const recipeImage = document.createElement("img");

        recipeTitle.innerText = data["title"];
        recipeCard.appendChild(recipeTitle);

        // recipeImage.setAttribute("src", data["imageUrl"]);
        // recipeCard.appendChild(recipeImage)
    
        this.shadowRoot.append(recipeCard);
    }

    get data(){
        return this.json;
    }
}

customElements.define("recipe-card", RecipeCard);