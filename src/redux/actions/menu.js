import Axios from "axios";

import config from '../../config';

export const getMenu = (menus) => {
    return {
        type: 'GET_MENU',
        payload: menus
    }
}

export const getMenuPending = () => {
    return {
        type: 'GET_MENU_PENDING'
    }
}

export const getMenuByCategory = (categoryId) => {
    return {
        type: 'GET_MENU_BY_CATEGORY',
        payload: categoryId
    }
}