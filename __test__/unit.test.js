// DON'T TOUCH THIS IMPORT STATEMENT PLEASE
import '../source/scripts/API/utilityFunctions.js'
/*
.then(importFunc => {
  console.log(importFunc);
})
.catch(err => console.log(err));*/
//import * as utilFunc from '../source/scripts/API/utilityFunctions.js';

// Below is copied from stack overflow
var localStorageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key) {
      delete store[key];
    }
  };
})();

test('setIntolerances Test', () => {
  
})

test('loadUserData Test', () => {

})

test('getFavoriteRecipes Test', () => {

})

test('getDeletedRecipes Test', () => {

})

test('addFavoriteRecipe Test', () => {

})

test('getFavoriteRecipe Test', () => {

})

test('removeFavoriteRecipe Test', () => {

})

test('removeRecipe test', () => {
  let object = {
    content: 'recipeToBeRemoved'
  }

  //localStorageMock.setItem('lmao', object)
  u.removeRecipe('lmao')
  //let item = localStorageMock.getItem('lmao')
  //expect(item).toBe('undefined')
})

test('updateUserData Test', () => {

})

test('populateRecipes Test', () => {

})

test('removeDeletedRecipes Test', () => {

})

test('searchLocalRecipes Test', () => {

})

test('fetchRecipes Test', () => {

})

test('fetchSummaries Test', () => {

})

test('createRecipeObject Test', () => {

})

test('getLocalStorageRecipes Test', () => {

})

test('setLocalStorageItem Test', () => {

})
