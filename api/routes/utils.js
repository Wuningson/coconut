const getCurrentDateTime = () => {
  const currentDate = new Date()

  let minutes = String(currentDate.getMinutes())
  let seconds = String(currentDate.getSeconds())
  let hours = currentDate.getHours() + 1

  if (minutes.length < 2) minutes = minutes.padStart(2, '0')
  if (seconds.length < 2) seconds = seconds.padStart(2, '0')

  let meridian = hours < 12 ? 'A.M.' : 'P.M.'

  if (hours > 12) hours = hours % 12

  const currentDateTime =
    currentDate.getDate() +
    '/' +
    (currentDate.getMonth() + 1) +
    '/' +
    currentDate.getFullYear() +
    ' at ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    ` ${meridian}`
  return currentDateTime
}

module.exports = getCurrentDateTime;
