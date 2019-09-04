const initialState = {
    data: [],
    dataByCategory: [],
    isCategory: false,
    isLoading: false
}

const menus = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_MENU':
            return {
                ...state,
                data: action.payload.data,
                isLoading: false
            }

        case 'GET_MENU_PENDING':
            return {
                ...state,
                isLoading: true
            }
    

        case 'GET_MENU_BY_CATEGORY':
            return {
                ...state,
                dataByCategory: state.data.filter(function(menu) {
                    return menu.categoryId == action.payload
                }),
                isCategory: action.payload != null ? true : false
            }

        default:
            return state
    }
}

export default menus