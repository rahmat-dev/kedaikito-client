const initialState = {
    data: [],
    isLoading: false
}

const orders = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            return {
                ...state,
                data: state.data.concat(action.payload),
                isLoading: false
            }
            
        case 'ADD_ORDER_PENDING':
            return {
                ...state,
                isLoading: true
            }
                
        case 'GET_ORDER':
            return {
                ...state,
                isLoading: false
            }

        case 'GET_ORDER_PENDING':
            return {
                ...state,
                isLoading: true
            }

        case 'REMOVE_ORDER':
            return {
                ...state,
                // data: state.data.slice(2, 1),
                isLoading: false
            }

        case 'REMOVE_ORDER_PENDING':
            return {
                ...state,
                isLoading: true
            }

        case 'ADD_QUANTITY':
            return {
                ...state,
                data: state.data.map((item, index) => {
                    if (item.menuId == action.payload) {
                        return {
                            ...item,
                            totalPrice: item.pricePerItem * (item.qty + 1),
                            qty: item.qty + 1,
                        }
                    }

                    return item
                }),
                isLoading: false
            }

        case 'REMOVE_QUANTITY':
            return {
                ...state,
                data: state.data.map((item, index) => {
                    if (item.menuId == action.payload) {
                        return {
                            ...item,
                            totalPrice: item.pricePerItem * (item.qty - 1),
                            qty: item.qty - 1,
                        }
                    }

                    return item
                }),
                isLoading: false
            }
    
        default:
            return state
    }
}

export default orders