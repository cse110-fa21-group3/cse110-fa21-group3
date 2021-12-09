import { addFavoriteRecipe, removeFavoriteRecipe } from './API/localStorageHandler.js'

// RECIPE TILES
const RECIPE_CARD_STYLE = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

article {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 290px;
  border-radius: 8px;
  background-color: white;
  height: 100%;
  width: 250px;
}

div {
  margin-top:0.25rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}

.time {
  font-size: 1rem
}

.icon {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 1rem;
  margin-right: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
}

.thumb-nail {
  border-radius: 8px;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: 200;
  width: auto;
}

.title {
  display: -webkit-box;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  line-height: 1.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

article:active .title{
  color: var(--red)
}

article:hover {
  box-shadow: 12px 12px 2px 1px var(--light-red);
}

article:hover .thumb-nail {
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}

article:hover .title {
  margin-top: 0rem;
  margin-left: 0.5rem;
}

article:hover button {
  right: 1.75rem;
  top: 1.25rem;
}

article:hover .icon{
  margin-left: 0.5rem;
}

button {
  width: 30px;
  height: 30px;
  position: absolute;
  background-color: transparent;
  border: none;
  right: 1.5rem;
  top: 1.5rem;
}

button::before {
  font-family: BlinkMacSystemFont;
  font-size: 28px;
  font-weight: bold;
  color: #233857;
  background-color: transparent;
  content: "♥";
  text-shadow: 0 0 2px #ffffff;
  position: absolute;
  transition: 0.2s;
  transform: translate(-50%, -50%);
}

button.liked::before {
  font-family: BlinkMacSystemFont;
  font-size: 28px;
  font-weight: bold;
  color: #233857;
  background-color: transparent;
  content: "♥";
  text-shadow: 0 0 2px #ffffff;
  position: absolute;
  transition: transform 0.2s;
  transform: translate(-50%, -50%) scale(0);
}

button::after {
  font-family: BlinkMacSystemFont;
  font-size: 28px;
  font-weight: bold;
  background-color: transparent;
  content: "♥";
  position: absolute;
  opacity: 0;
  transition: transform 0.2s;
  transform: translate(-50%, -50%) scale(0);
}

button.liked::after {
  font-family: BlinkMacSystemFont;
  font-size: 28px;
  font-weight: bold;
  background-color: transparent;
  color: var(--red);
  content: "♥";
  position: absolute;
  opacity: 1;
  transition: transform 0.2s;
  transform: translate(-50%, -50%) scale(1);
}
`

/**
 * Creates Recipes Cards for the DOM and has styling for it as well
 */
class RecipeCard extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  set data (data) {
    if (!data) return
    this.json = data

    // Recipe card css
    const style = document.createElement('style')
    style.innerHTML = RECIPE_CARD_STYLE

    const recipeCard = document.createElement('article')
    const recipeImage = document.createElement('img')
    const timeSection = document.createElement('div')
    const recipeTitle = document.createElement('p')
    const recipeTime = document.createElement('div')
    const clockIcon = document.createElement('img')
    const likeBtn = document.createElement('button')

    recipeTitle.classList.add('title')
    recipeImage.classList.add('thumb-nail')
    clockIcon.classList.add('icon')
    recipeTime.classList.add('time')

    recipeImage.setAttribute('src', data.image)
    clockIcon.setAttribute('src', './source/image/iconmonstr-time-10.svg')
    recipeTitle.innerText = data.title
    recipeTime.innerText = data.readyInMinutes + ' mins'
    if (this.json.favorite) {
      likeBtn.classList.add('liked')
    }

    recipeCard.appendChild(recipeImage)
    recipeCard.appendChild(likeBtn)
    timeSection.appendChild(clockIcon)
    timeSection.appendChild(recipeTime)
    recipeCard.appendChild(timeSection)
    recipeCard.appendChild(recipeTitle)
    this.shadowRoot.append(style, recipeCard)

    likeBtn.addEventListener('click', event => {
      likeBtn.classList.toggle('liked')
      if (!this.json.favorite) {
        addFavoriteRecipe(this.json.id)
        this.json.favorite = true
      } else {
        removeFavoriteRecipe(this.json.id)
        this.json.favorite = false
      }
      event.stopPropagation()
    })
  }

  get data () {
    return this.json
  }
}

customElements.define('recipe-card', RecipeCard)
