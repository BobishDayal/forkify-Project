//import {async} from 'regenerator-runtime';
import { API_URL } from "./config";
import { AJAX } from "./helpers";
import { RES_PER_PAGE } from "./config";
import { KEY } from "./config";

export const state = {

    recipe: {},
    search : {
      source : '',
      results : [],
      resultPerPage: RES_PER_PAGE,
      page: 1,
    },

    bookmarks: [],

};


generateRecipeObject = function(data){
 const {recipe} = data.data;
  return {
    cookingTime : recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key}),

  };
};

export const loadRecipe =  async function(id){
   try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    
    state.recipe = generateRecipeObject(data);


    if (state.bookmarks.some(bookmark => bookmark.id === id))
    state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;


    } catch (err){
        throw err;
      }
};

export const loadSearchResult = async function(query){

  try{
    
    state.search.source = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
    
    state.search.results = data.data.recipes.map( rec=>{
      return {
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        id: rec.id,
        ...(rec.key && {key: rec.key}),

        
      };

    });

    state.search.page = 1;
    
  }catch (err){
    console.log(`${err} 💥💥💥`);
    throw err;
  }

};

export const getSearchResultPage = function(page = state.search.page){

  state.search.page = page;

  const start = (page-1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);


};

export const updateServings = function(newServings){

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

});
state.recipe.servings = newServings;

};


const pressitBookmarks = function(){
  
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))

};

export const addBookmark = function(recipe){
  state.bookmarks.push(recipe);

  //// mark current recipe as a bookmark

  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  pressitBookmarks();


};

export const removeBookmark = function(id){
   // remove bookmark 
  const index = state.bookmarks.findIndex(el=> el.id === id);
  state.bookmarks.splice(index , 1);

  //mark current recipe as not bookmarked
  if(id === state.recipe.id) state.recipe.bookmarked = false;
  pressitBookmarks();
   
};

const init = function(){

  const storage = localStorage.getItem('bookmarks');

  if(storage) state.bookmarks = JSON.parse(storage);

  //state.bookmarks.push(...JSON.parse(storage || []));
}
init();

const clearBookmarks = function(){

  localStorage.clear('bookmarks');
};
//clearBookmarks();

export const uploadRecipe =  async function(newRecipe){

  try {
    
    const ingredients = Object.entries(newRecipe)
  .filter(entry=> entry[0].startsWith('ingredient') && entry[1] !== '')
  .map(ing => {

    const ingArr = ing[1].split(',').map(el=> el.trim());

    if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format.');

   const [quantity, unit, description] = ingArr;



   return {quantity: quantity? +quantity: null, unit, description};

  });

  const recipe = {

    source_url: newRecipe.sourceUrl,
    title: newRecipe.title,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    id : newRecipe.id,
    cooking_time : +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };

 

  const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
  state.recipe = generateRecipeObject(data);
  addBookmark(state.recipe);
  
  
}catch ( err){
  throw err;
}
  
};



