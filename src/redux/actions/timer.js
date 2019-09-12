import timerFormat from '../../utils/timerFormat'

export const getTimer = () => {
  return {
    type: 'GET_TIMER'
  }
}

export const addTimer = (seconds) => {
  return {
    type: 'ADD_TIMER',
    payload: seconds,
  }
}