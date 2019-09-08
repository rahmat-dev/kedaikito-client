export const addOrder = (item, transactionId) => {
    return {
        type: 'ADD_ORDER',
        payload: {
            menuId: item.id,
            transactionId,
            name: item.name,
            image: item.image,
            qty: 1,
            pricePerItem: item.price,
            totalPrice: item.price,
            status: 0
        }
    }
}

export const addOrderPending = () => {
    return {
        type: 'ADD_ORDER_PENDING'
    }
}

export const getOrder = () => {
    return {
        type: 'GET_ORDER',
    }
}

export const getOrderPending = () => {
    return {
        type: 'GET_ORDER_PENDING'
    }
}

export const removeOrder = (index) => {
    return {
        type: 'REMOVE_ORDER',
        payload: index
    }
}

export const removeOrderPending = () => {
    return {
        type: 'REMOVE_ORDER_PENDING'
    }
}

export const addQuantity = (menuId, price) => {
    return {
        type: 'ADD_QUANTITY',
        payload: {
            menuId, price
        }
    }
}

export const removeQuantity = (menuId, price) => {
    return {
        type: 'REMOVE_QUANTITY',
        payload: {
            menuId, price
        }
    }
}