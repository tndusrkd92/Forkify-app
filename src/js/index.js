import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'; 
import * as recipeView from './views/recipeView'; 
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

/*
* SEARCH CONTROLLER
*/
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for the results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults(); 

            // 5) Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch {
            alert('Something wrong with search...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResults(state.search.result, goToPage);
    }
}); 

/*
* RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id); 

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculating servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();

            // Render recipe
            console.log(state.recipe);
        } catch (error){
            alert('Error processing recipe!');
        }
    };
};

/* 
// Apply multiple mehod to the same place.
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
*/
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); 
