export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();
        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;                     // TRUE --> It is liked !
    }

    getNumLikes () {
        return this.likes.length;
    }

    persistData () {
        localStorage.setItem('likes', JSON.stringify(this.likes));                  // Convert an array into string
    }

    readStorage () {
        const storage = JSON.parse(localStorage.getItem('likes'));                    // Convert from string into a data structure

        // Restoring likes from localStorage
        if (storage) this.likes = storage;
    }
};