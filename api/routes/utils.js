const getCurrentDateTime = ()=> {
  const currentdate = new Date();
  const currentDateTime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  return currentDateTime;
}

module.exports = getCurrentDateTime;
