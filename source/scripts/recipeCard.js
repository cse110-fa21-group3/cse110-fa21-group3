// RECIPE TILES
const RECIPE_CARD_STYLE = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out;
}

article {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: white;
  height: 100%;
  width: 250px;
}

div {
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
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  line-height: 1.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

article:active .title{
  color: var(--red)
}

article:hover {
  box-shadow: 12px 12px 2px 1px var(--light-red);
}

article:hover .thumb-nail{
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}

article:hover .title{
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}

article:hover .icon{
  margin-left: 0.5rem;
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
    recipeTitle.classList.add('title')
    recipeImage.classList.add('thumb-nail')
    clockIcon.classList.add('icon')
    recipeTime.classList.add('time')


    recipeImage.setAttribute('src', data.image)
    clockIcon.setAttribute('src', './source/image/iconmonstr-time-10.svg')
    recipeTitle.innerText = data.title
    recipeTime.innerText = data.readyInMinutes + ' mins'

    recipeCard.appendChild(recipeImage)
    timeSection.appendChild(clockIcon)
    timeSection.appendChild(recipeTime)
    recipeCard.appendChild(timeSection)
    recipeCard.appendChild(recipeTitle)
    this.shadowRoot.append(style, recipeCard)
  }

  get data () {
    return this.json
  }
}

customElements.define('recipe-card', RecipeCard)
