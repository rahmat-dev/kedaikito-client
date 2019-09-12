export default timerFormat = (timer) => {
  let minutes = parseInt(timer / 60)
  let seconds = timer - minutes * 60

  if (minutes <= 9)
      minutes = '0' + minutes

  if (seconds <= 9)
      seconds = '0' + seconds

  return `${minutes} : ${seconds}`
}