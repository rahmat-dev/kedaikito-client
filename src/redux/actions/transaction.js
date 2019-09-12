export const getTransaction = () => {
    return {
        type: 'GET_TRANSACTION',
    }
}

export const addTransaction = (dataTransaction) => {
    return {
        type: 'ADD_TRANSACTION',
        payload: dataTransaction
    }
}