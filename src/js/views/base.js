export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu:  document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementString = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const markup = `
        <div class="${elementString.loader}">
            <svg> 
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterBegin', markup);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};