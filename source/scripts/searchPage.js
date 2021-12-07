import { searchLocalRecipes } from './API/utilityFunctions.js'

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fav-container').addEventListener('click', () => {
    window.location.href = '/searchpage.html#favorites'
    window.location.reload()
  })

  const searchBtn = document.getElementById('search-icon')
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const searchQuery = document.getElementById('search-bar').value
    searchLocalRecipes(searchQuery).then((arr) => {
      const res = []
      arr.forEach((recipe) => {
        res.push(recipe.id)
      })
      const searchObj = {
        data: res,
        query: searchQuery,
        matchedCount: arr.length
      }
      localStorage.setItem('latestSearch', JSON.stringify(searchObj))
      window.location.href = '/searchpage.html'
    })
  })

  let results = localStorage.getItem('latestSearch')
  const queryDisplay = document.getElementById('query-display')
  const matchedCountText = document.getElementById('matched-count-text')

  if (window.location.hash === '#favorites') {
    results = JSON.parse(localStorage.getItem('userData')).favorites
    queryDisplay.innerText = 'Showing Favorites'
    matchedCountText.innerText = results.length
  } else if (results) {
    results = JSON.parse(results)

    if (results.matchedCount === 0) {
      alert('No results found')
      window.location.href = '/index.html'
      return
    }
    queryDisplay.innerText = `${'Showing results for: ' + '"'}${results.query}"`
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
