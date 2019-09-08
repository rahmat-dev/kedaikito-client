const initialState = {
    data: {},
    isLoading: false
}

const transactions = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TRANSACTION':
            return {
                ...state,
                data: action.payload,
                isLoading: false
            }

        default:
            return state
    }
}

export default transactions