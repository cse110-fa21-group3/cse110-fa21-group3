// RECIPE TILES

class RecipeCard extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(data){
        if(!data) return;
        this.json = data;

        // Recipe card css
        const style = document.createElement('style');
        style.innerHTML = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        ------------> TODO: start here (attaching style to shadowRoot is done)
        `;

        const recipeCard = document.createElement("article");
        const recipeImage = document.createElement("img");
        const recipeTitle = document.createElement("p");
        
        recipeImage.setAttribute("src", data["image"]);
        recipeTitle.innerText = data["title"];
        
        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(recipeTitle);
        this.shadowRoot.append(style, recipeCard);
    }

    get data(){
        return this.json;
    }
}

customElements.define("recipe-card", RecipeCard);