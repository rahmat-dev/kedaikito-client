import timerFormat from '../../utils/timerFormat'

const initialState = {
  seconds: 0,
  timerFormat: null
}

const timer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TIMER':
      return {
        ...state
      }

    case 'ADD_TIMER':
      return {
        ...state,
        seconds: action.payload,
        timerFormat: timerFormat(action.payload)
      }
  
    default:
      return state
  }
}

export default timer