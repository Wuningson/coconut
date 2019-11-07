//Schedule the node-cron to tweet SOS on the first schedule then the second will be mia


const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);
const cron = require('node-cron');

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
      // res.status(500).json({
      //   message: `Status update failed`
      // })
      console.log(`Status update failed ${err}`);
      process.exit(1);
    }
    else{
      // res.status(201).json({
      //   message: `Status update sent`
      // }) 
      console.log(`${data}`);
      process.exit(0);
    }
  });
}


router.post('/', async (req, res)=> {
  const { username, saved } = req.body;

  if (saved === "true"){
    await postSurvived(username, res);
  }

  await postSos(username, res);

  cron.schedule('*/1 * * *', postMia(username, res, long, lat));

});

module.exports = router;