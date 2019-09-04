export const getCategories = (categories) => {
    return {
        type: 'GET_CATEGORIES',
        payload: categories
    }
}

export const getCategoriesPending = () => {
    return {
        type: 'GET_CATEGORIES_PENDING'
    }
}