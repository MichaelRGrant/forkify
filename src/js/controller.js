import * as model from './model.js';
import { MODAL_CLOSE_SECONDS } from './config.js';
import recipeView from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { search } from 'core-js/fn/symbol';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // update results view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Loading the recipe
    await model.loadRecipe(id);
    // console.log(model.state);

    // Rendering recipe
    recipeView.render(model.state.recipe);

    // updating bookmarks view

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // get query from user input
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // Load the search recipes.
    await model.loadSearchResults(query);
    // render search results

    // render search results
    resultsView.render(model.getSearchResultsPage());

    // render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // render search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (changeServings) {
  // Update the recipe servings (in state)
  model.updateServings(changeServings);

  // Rendering recipe
  // recipeView.render(model.state.recipe);
  // Only update text and attributes in the DOM
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove a bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // update recipe view
  recipeView.update(model.state.recipe);

  // render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addRecipeView.renderSpinner();

    // Upload recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
