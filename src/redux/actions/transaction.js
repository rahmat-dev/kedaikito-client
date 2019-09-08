export const getTransaction = (dataTransaction) => {
    return {
        type: 'GET_TRANSACTION',
        payload: dataTransaction
    }
}