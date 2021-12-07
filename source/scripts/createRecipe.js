import * as LSHandler from './API/localStorageHandler.js'

const recipeImg = document.getElementById('recipe-img')
let compressedImg // store base64 compressed image (string)

const addIng = document.getElementById('add-ing')
const addStep = document.getElementById('add-step')
const addNutrition = document.getElementById('add-nutrition')

const createRecipe = document.getElementById('create-btn')
const cancelBtn = document.getElementById('cancel-btn')

window.addEventListener('DOMContentLoaded', e => {
  if (window.location.hash) {
    const id = window.location.hash.slice(1)
    const recipeData = JSON.parse(localStorage.getItem(id))
    populateRecipeForm(recipeData)
    createRecipe.innerText = 'Update'
  }
})

recipeImg.addEventListener('change', (e) => {
  const input = e.target.files[0]
  const previewImg = document.getElementById('preview-img')
  const fileReader = new FileReader()

  fileReader.addEventListener('load', (event) => {
    previewImg.src = event.target.result
    previewImg.classList.remove('no-preview')

    // resizing and compressing input image using <canvas>
    previewImg.addEventListener('load', (imgData) => {
      const canvas = document.createElement('canvas')
      const FIXED_WIDTH = 312 * 2
      const FIXED_HEIGHT = 231 * 2

      canvas.width = FIXED_WIDTH
      canvas.height = FIXED_HEIGHT

      const ctx = canvas.getContext('2d')
      ctx.drawImage(imgData.target, 0, 0, canvas.width, canvas.height)
      const imgEncoded = ctx.canvas.toDataURL(imgData, 'image/jpeg')
      compressedImg = imgEncoded
    })
  })

  if (input) {
    fileReader.readAsDataURL(input)
  }
})

addIng.addEventListener('click', e => {
  const elementContainerIng = document.querySelectorAll('.ingredient-container')
  const elementContainerLengthIng = elementContainerIng.length
  const fieldSetIng = document.createElement('fieldset')
  const fieldSetLabelIng = document.createElement('label')
  const fieldTextAreaIng = document.createElement('textarea')
  const deleteBtnIng = document.createElement('button')

  deleteBtnIng.type = 'button'
  deleteBtnIng.classList.add('remove-btn')
  const removeIconIng = document.createElement('img')
  removeIconIng.src = './source/image/icons8-delete.svg'
  removeIconIng.style.width = '30px'
  deleteBtnIng.appendChild(removeIconIng)
  deleteBtnIng.addEventListener('click', removeItem)

  fieldSetLabelIng.innerText = 'Ingredient: '

  fieldTextAreaIng.name = 'ingredients'

  fieldTextAreaIng.classList.add('ing-name')
  // fieldTextArea.type = 'text';
  fieldTextAreaIng.cols = '30'
  fieldTextAreaIng.rows = '2'

  fieldSetIng.classList.add('ingredient-container')

  fieldSetIng.appendChild(fieldSetLabelIng)
  fieldSetIng.appendChild(fieldTextAreaIng)
  fieldSetIng.appendChild(deleteBtnIng)

  elementContainerIng[elementContainerLengthIng - 1].after(fieldSetIng)
})

addStep.addEventListener('click', e => {
  const elementContainer = document.querySelectorAll('.steps-container')
  const elementContainerLength = elementContainer.length
  const fieldSet = document.createElement('fieldset')
  const fieldSetLabel = document.createElement('label')
  const fieldTextArea = document.createElement('textarea')
  const deleteBtn = document.createElement('button')

  deleteBtn.type = 'button'
  deleteBtn.classList.add('remove-btn')
  const removeIcon = document.createElement('img')
  removeIcon.src = './source/image/icons8-delete.svg'
  removeIcon.style.width = '30px'
  deleteBtn.appendChild(removeIcon)
  deleteBtn.addEventListener('click', removeItem)

  fieldSetLabel.innerText = 'Step: '

  fieldTextArea.name = 'steps'

  fieldTextArea.classList.add('stepName')
  // fieldTextArea.type = 'text';
  fieldTextArea.cols = '50'
  fieldTextArea.rows = '5'

  fieldTextArea.classList.add('step-name')
  // fieldTextArea.type = 'text';
  fieldTextArea.cols = '50'
  fieldTextArea.rows = '5'

  fieldSet.classList.add('steps-container')
  fieldSet.appendChild(fieldSetLabel)
  fieldSet.appendChild(fieldTextArea)
  fieldSet.appendChild(deleteBtn)

  elementContainer[elementContainerLength - 1].after(fieldSet)
})

addNutrition.addEventListener('click', e => {
  const elementContainerNutrition = document.querySelectorAll('.nutrition-container')
  const elementContainerLengthNutrition = elementContainerNutrition.length
  const fieldSetNutrition = document.createElement('fieldset')
  const fieldSetLabelNutrition = document.createElement('label')
  const fieldTextAreaNutrition = document.createElement('textarea')
  const deleteBtnNutrition = document.createElement('button')

  deleteBtnNutrition.type = 'button'
  deleteBtnNutrition.classList.add('remove-btn')
  const removeIconNutrition = document.createElement('img')
  removeIconNutrition.src = './source/image/icons8-delete.svg'
  removeIconNutrition.style.width = '30px'
  deleteBtnNutrition.appendChild(removeIconNutrition)
  deleteBtnNutrition.addEventListener('click', removeItem)

  fieldSetLabelNutrition.innerText = 'Nutrition: '

  fieldTextAreaNutrition.name = 'nutrition'

  fieldTextAreaNutrition.classList.add('nutr-name')
  // fieldTextArea.type = 'text';
  fieldTextAreaNutrition.cols = '30'
  fieldTextAreaNutrition.rows = '2'

  fieldSetNutrition.classList.add('nutrition-container')
  fieldSetNutrition.appendChild(fieldSetLabelNutrition)
  fieldSetNutrition.appendChild(fieldTextAreaNutrition)
  fieldSetNutrition.appendChild(deleteBtnNutrition)

  elementContainerNutrition[elementContainerLengthNutrition - 1].after(fieldSetNutrition)
})

function removeItem (e) {
  const i = e.path[0].tagName === 'IMG' ? 0 : 1
  const parentContainer = e.path[3 - i]
  const fieldSet = e.path[2 - i]
  parentContainer.removeChild(fieldSet)
}

createRecipe.addEventListener('click', e => {
  e.preventDefault()
  const formRes = {
    id: '',
    image: '',
    favorite: true,
    readyInMinutes: 0,
    servingSize: 0,
    title: '',
    summary: '',
    ingredients: [],
    ingredientSearch: '',
    steps: [],
    nutrition: []
  }
  const formData = document.getElementById('recipe-form')
  const formObj = new FormData(formData)
  const formKeys = Array.from(formObj.keys())
  const hash = window.location.hash

  if (hash) {
    const currRecipe = JSON.parse(localStorage.getItem(hash.slice(1)))
    if (hash.slice(1, 4) === 'ucr') {
      const title = formObj.get('title')
      if (title !== currRecipe.title) {
        localStorage.removeItem(hash.slice(1))
      }
      formRes.id = 'ucr_' + title.replaceAll(' ', '')
    } else {
      formRes.id = currRecipe.id
      formRes.image = currRecipe.image
      formRes.favorite = false
    }
  } else {
    const title = formObj.get('title')
    formRes.id = 'ucr_' + title.replaceAll(' ', '')
    LSHandler.addFavoriteRecipe(formRes.id)
  }

  formKeys.forEach(key => {
    const res = formObj.getAll(key)

    if (key === 'steps' || key === 'nutrition' || key === 'ingredients') {
      formRes[key] = formObj.getAll(key)
    } else if (key === 'recipeDesc') {
      formRes.summary = res[0]
    } else if (key === 'image') {
      const defaultImg = '../../admin/branding/logo3_231x231.jpg'
      formRes[key] = (compressedImg || defaultImg)
    } else {
      formRes[key] = res[0]
    }
  })

  formRes.ingredients.forEach(ing => {
    formRes.ingredientSearch += ing
  })

  LSHandler.setLocalStorageItem(formRes.id, formRes)
  window.location.href = '/index.html'
})

cancelBtn.addEventListener('click', e => {
  window.location.href = '/index.html'
})

function populateRecipeForm (recipeData) {
  document.getElementById('recipe-name').value = recipeData.title
  document.getElementById('recipe-time').value = recipeData.readyInMinutes
  document.getElementById('recipe-desc').value = recipeData.summary
  document.getElementById('recipe-serve').value = recipeData.servingSize

  // Image fill-in
  const previewImg = document.getElementById('preview-img')
  const defaultImg = '../../admin/branding/logo3_231x231.jpg'

  if (recipeData.image === defaultImg) {
    compressedImg = defaultImg
  } else {
    previewImg.src = recipeData.image
    compressedImg = recipeData.image
    previewImg.classList.remove('no-preview')
  }

  populateLists(recipeData)
}

/**
 * responsible for populating the list field like ingredirents, steps, and nutritions
 * @param {*} recipeData - json data of recipe
 */
function populateLists (recipeData) {
  // Ingredients fill-in
  const numIng = recipeData.ingredients.length
  const ingInputs = document.getElementsByClassName('ing-name')
  for (let i = 0; i < numIng - 1; i++) {
    addIng.click()
    ingInputs[i].value = recipeData.ingredients[i]
  }
  ingInputs[numIng - 1].value = recipeData.ingredients[numIng - 1]

  // Steps fill-in
  const numSteps = recipeData.steps.length - 1
  const stepInputs = document.getElementsByClassName('step-name')
  for (let i = 0; i < numSteps - 1; i++) {
    addStep.click()
    stepInputs[i].value = recipeData.steps[i]
  }
  stepInputs[numSteps - 1].value = recipeData.steps[numSteps - 1]

  // Nutrition fill-in
  const numNutrients = recipeData.nutrition.length
  const nutritionInputs = document.getElementsByClassName('nutr-name')
  for (let i = 0; i < numNutrients - 1; i++) {
    addNutrition.click()
    nutritionInputs[i].value = recipeData.nutrition[i]
  }
  nutritionInputs[numNutrients - 1].value = recipeData.nutrition[numNutrients - 1]
}
