import axios from 'axios';
import { api } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios();
        } catch (error) {
            console.log(error);
        }
    }
};

