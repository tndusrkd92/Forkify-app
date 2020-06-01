import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as  listView from './views/listView'; 
import * as searchView from './views/searchView'; 
import * as recipeView from './views/recipeView'; 
import * as likesView from './views/likesView'; 
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};
window.state = state;

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
    const btn = e.target.closest('.btn-inline');                                    // Event delegation : closest
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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search
        if (state.search)   searchView.highlighteSelected(id);

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
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
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


/*
* LIST CONTROLLER 
*/
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;                                         // Dataset and data attribute

    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-account')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});



/*
* LIKE CONTROLLER 
*/

// TESTING
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());


const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);
        
    // User has liked current recipe    
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};



// Handling recipe button clicks                                                                            // Event delegation : matches  (multiple elements on same parent)                                  
elements.recipe.addEventListener('click', e => {
    if (e.target.matches(`.btn-decrease, .btn-decrease *`)) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        };
    } else if (e.target.matches(`.btn-increase, .btn-increase *`)) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(`.recipe__btn--add, .recipe__btn--add *`)) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
