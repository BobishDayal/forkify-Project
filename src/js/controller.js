//import icons from 'url:../img/icons.svg'

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';


//if(module.hot){
 // module.hot.accept();
//}

/////////////////////////////////////////////////////
//////////////////////// controllers ////////////////

const controlRecipe = async function(){
  try{

    const id = window.location.hash.slice(1);
    if (!id) return;

    //0 results view to mark selected serch result
    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);
    
    //render spinner
    recipeView.renderSpinner();
    
    //loading recepie
    await model.loadRecipe(id);
    
    ///rendering the detals
    recipeView.render(model.state.recipe);
    
  
    

  } catch (err){
   recipeView.renderError();
  }
};



//////////////////////////////////////////////////////
const controlSearch = async function(){

  try {
    //render spinner
    resultsView.renderSpinner();

    
    
    //1 get the search query
    const query = searchView.getQuery();
    
    if(!query) return ;
    
    //2load search result
    await  model.loadSearchResult(query);
    
    //3 render results
    resultsView.render(model.getSearchResultPage());

    //4 implement the pagination on result
    paginationView.render(model.state.search);
    
    

  }catch(err){
    console.log(err);
  }

};


////////////////////////////////////////////////////////////

const contolPagination = function(gotoPage){
  //showing the page 
  resultsView.render(model.getSearchResultPage(gotoPage));

  // showing and updating the buttons
  paginationView.render(model.state.search);
  
};



///////////////////////////////////////////////////////

const controlServings = function(newServings){
 ///1 update servings in the recepie 
model.updateServings(newServings);

 //2 render it to the ui
// recipeView.render(model.state.recipe);
 recipeView.update(model.state.recipe);
};

/////////////////////////////////////////////////////

const controlAddBookmark = function(){
//1 add/remove bookmark
if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
else model.removeBookmark(model.state.recipe.id);

//update recepie view
recipeView.update(model.state.recipe);

//render bookmark
bookmarksView.render(model.state.bookmarks);

};

////////////////////////////////////////////////

const controlBookmarks = function(){

  bookmarksView.render(model.state.bookmarks);
};

////////////////////////////////////////////////

const controlAddRecipe = async function(newRecipe){
try{

/// show spinner
addRecipeView.renderSpinner();

await  model.uploadRecipe(newRecipe);

//// render recipe 
recipeView.render(model.state.recipe);

//success message 
addRecipeView.renderMessage();

//render the bookmark view
bookmarksView.render(model.state.bookmarks);

//change ID in url
window.history.pushState(null, '', `#${model.state.recipe.id}`);

/// close form window 

setTimeout(function(){

addRecipeView.toggleWindow();

},MODAL_CLOSE_SEC * 1000);

}catch(err){
addRecipeView.renderError(`${err.message}`);

}
};

///////////////////////////////////////////////

const init = function(){
bookmarksView.addHandlerRender(controlBookmarks);  
recipeView.addHandlerRender(controlRecipe);
recipeView.addHandlerUpdateServings(controlServings);
recipeView.addHandlerGenerateAddBookmark(controlAddBookmark)
searchView.addHandlerSearch(controlSearch);
paginationView.addHandlerClick(contolPagination);
addRecipeView.addHandlerUpload(controlAddRecipe);
//controlServings();

};
init();