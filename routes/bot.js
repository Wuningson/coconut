const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);

const postSos = (username, res) => {
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives at this location`}, (err, data, response) => {
    if (err){
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
    }else{
      console.log(data);
      res.status(200).json({
        message: `Status update sent successfully`
      });
    }
  });
}


const postMia = (username, res) => {
  T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, last location is shared below`}, (err, data, response) => {
    if (err) console.log(`Status update failed ${err}`);
    else console.log(`Success`);
  });
}

const postSurvived = (username, res) => {
  T.post('statuses/update', {status: `@${username} has survived SARS`}, (err, data, response) => {
    if (err){ 
      console.log(`Status update failed ${err}`);
      process.exit(1);
    }
    else{
      console.log(`${data}`);
      process.exit(0);
    }
  });
}


router.post('/', async (req, res)=> {
  const { username, saved, long, lat } = req.body;

  if (saved === "true"){
    await postSurvived(username, res);
  }

  await postSos(username, res);

  const time = 1000 * 3600;
  const sendMia = setTimeout(postMia, time, username);
  sendMia;

});

module.exports = router;