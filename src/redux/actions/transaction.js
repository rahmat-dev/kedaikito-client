export const addTransaction = (dataTransaction) => {
    return {
        type: 'ADD_TRANSACTION',
        payload: dataTransaction
    }
}