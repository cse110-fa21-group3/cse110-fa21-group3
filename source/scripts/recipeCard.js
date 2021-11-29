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

        article {
            display: flex;
            flex-direction: column;
            border: 1px solid black;
            border-radius: 8px;
            padding: 1rem 1rem;
            background-color: white;
            transition: all 0.2s ease;
            height: 100%;
        }

        article:hover {
            box-shadow: 0px 0px 10px grey;
        }

        article:active {
            box-shadow: 0 0;
        }

        article > img {
            border-radius: 8px;
            object-fit: cover;
            max-width: 100%;
            height: auto;
        }

        article > p {
            justify-self: initial;
            margin-top: 1rem;
            line-height: 1.5rem;
        }
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