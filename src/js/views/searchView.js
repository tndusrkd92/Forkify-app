import { elements } from './base';

export const getInput = () => elements.searchInput.value;           // arrow function automatically return its value.

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResList.innerHTML = '';
};

/*  
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / new title = ['Pasta']  
acc: 5 / acc + cur.length = 9 / new title = ['Pasta', 'with']  
acc: 9 / acc + cur.length = 15 / new title = ['Pasta', 'with', 'tomato']  
acc: 15 / acc + cur.length = 18 / new title = ['Pasta', 'with', 'tomato']  
acc: 18 / acc + cur.length = 24 / new title = ['Pasta', 'with', 'tomato']  
*/
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {                                        // Split : split strings and return as an array.
        title.split(' ').reduce((acc, cur) => {                      
            if(acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;                                   // reduce method ruturns a new accumulator.
        }, 0);

        // return the result
        return `${newTitle.join(' ')}...`;                             // Join: put elements of an array into strings together.
    }
    return title;
};

const renderRecipe = recipe => {
    const markUp = 
    `
    <li>
        <a class="results__link" href="#${recipe.image_url}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.searchResList.insertAdjacentHTML('beforeend', markUp);
};

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};