const initialState = {
    data: [],
    qtyTotal: 0,
    priceTotal: 0,
    isLoading: false
}

const orders = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            return {
                ...state,
                data: state.data.concat(action.payload),
                qtyTotal: state.qtyTotal + 1,
                priceTotal: state.priceTotal + action.payload.totalPrice,
                isLoading: false
            }
            
        case 'GET_ORDER':
            return {
                ...state,
                isLoading: false
            }

        case 'REMOVE_ORDER':
            return {
                ...state,
                // data: state.data.slice(2, 1),
                isLoading: false
            }

        case 'ADD_QUANTITY':
            return {
                ...state,
                data: state.data.map(item => {
                    if (item.menuId == action.payload.menuId) {
                        return {
                            ...item,
                            totalPrice: item.pricePerItem * (item.qty + 1),
                            qty: item.qty + 1,
                        }
                    }

                    return item
                }),
                qtyTotal: state.qtyTotal + 1,
                priceTotal: state.priceTotal + action.payload.price,
                isLoading: false
            }

        case 'REMOVE_QUANTITY':
            return {
                ...state,
                data: state.data.map(item => {
                    if (item.menuId == action.payload.menuId) {
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