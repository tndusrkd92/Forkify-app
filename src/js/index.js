import Search from './models/Search';

/* Global state of app
* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const status = {};

const controlSearch = () => {
    // 1) get query from view
    const query = 'pizza' //TODO


}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

const search = new Search('pizza');
console.log(search);
search.getResults(); 
