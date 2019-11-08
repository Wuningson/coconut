const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);

const postSos = (username, res, long, lat) => {
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives at this location`}, {"geo": { "type":"Point", "coordinates":[lat, long] }}, (err, data, response) => {
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


const postMia = (username, res, long, lat) => {
  T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, last location is shared below`}, {"geo": { "type":"Point", "coordinates":[lat, long] }}, (err, data, response) => {
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
  const { username, saved, long, lat, access_token, access_token_secret } = req.body;
  config.access_token = access_token;
  config.access_token_secret = access_token_secret;

  if (saved === "true"){
    await postSurvived(username, res);
  }

  await postSos(username, res, long, lat);

  const time = 1000 * 3600;
  const sendMia = setTimeout(postMia, time, username, long, lat);
  sendMia;

});

module.exports = router;