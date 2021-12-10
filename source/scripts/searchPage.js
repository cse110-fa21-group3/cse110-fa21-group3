import { searchLocalRecipes } from './API/localStorageHandler.js'

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fav-container').addEventListener('click', () => {
    window.location.href = '/searchpage.html#favorites'
    window.location.reload()
  })

  const searchBtn = document.getElementById('search-icon')
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const searchQuery = document.getElementById('search-bar').value
    searchLocalRecipes(searchQuery).then(() => {
      window.location.href = '/searchpage.html'
    })
  })

  let results = localStorage.getItem('latestSearch')
  const queryDisplay = document.getElementById('query-display')
  const matchedCountText = document.getElementById('matched-count-text')

  if (window.location.hash === '#favorites') {
    queryDisplay.innerText = 'Favorited Recipes'
    document.querySelector('head > title').innerText = 'Favorites'
    let favorites
    if (localStorage.getItem('userData')) {
      favorites = JSON.parse(localStorage.getItem('userData')).favorites
    }
    if (!favorites || favorites.length === 0) {
      matchedCountText.innerText = 'Nothing is found, go favorite a recipe!'
      return
    }
    matchedCountText.innerText = favorites.length
    results = favorites
  } else if (results) {
    results = JSON.parse(results)
    queryDisplay.innerText = `${'Showing results for: ' + '"'}${results.query}"`
    if (!results || results.matchedCount === 0) {
      // alert('No results found')
      matchedCountText.innerText = '0 results found'
      return
    }
    matchedCountText.innerText = `${results.matchedCount} results found`
    results = results.data
  }

  results.forEach((id) => {
    const recipeCardsSection = document.getElementById('recipe-cards')
    const recipeCard = document.createElement('recipe-card')
    const recipeData = JSON.parse(localStorage.getItem(id))
    // console.log(recipeData)
    recipeCard.data = recipeData
    recipeCardsSection.appendChild(recipeCard)
    recipeCard.addEventListener('click', () => {
      // router.navigate(id)
      window.location.href = `/recipePage.html#${id}`
    })
  })
})
