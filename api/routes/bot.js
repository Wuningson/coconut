const express = require('express');
const router = express.Router();
const Twit = require('twit');
const token = require('../config/token');
const T = new Twit(token);
const Updates = require('../models/Updates');
const getCurrentDateTime = require('./utils');

const time = getCurrentDateTime()
const tweet = ` is about to be picked up by SARS operatives at this location on ${time}`;

const postSos = (username, res) => {
  T.post('statuses/update', {status: `@${username} ${tweet}`}, (err, data, response) => {
    if (err){
      console.log(err);
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
      
    }else{
      console.log(`Status update sent successfully`);
      const status = "SOS";
      const time = data.created_at;
      const displayName = data.user.name;
      console.log(`status is ${status}, time created is ${time}, displayName is ${displayName}`)
      const update = new Updates({
        username,
        displayName,
        status,
        time
      });
      update.save().then(doc => console.log(doc)).catch(err => console.log(err));
      res.status(200).json({
        message: `Status update sent successfully`
      });
    }
  });
}


const postMia = (username, res) => {
  T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, last location is shared below on ${time}`}, (err, data, response) => {
    if (err) console.log(`Status update failed ${err}`);
    else {
      Updates.findOne({username}).then(user => {
        user.status = "MIA";
        user.save().then(doc => console.log(`Status Update sent and data update successful`)).catch(err => `User data update failed. Error occurred ${err}`)
      }).catch(err => {
        console.log(`User not found`);
      });
    };
  });
}

const postSurvived = async (username, res) => {
  T.post('statuses/update', {status: `@${username} has survived SARS on ${time}`}, (err, data, response) => {
    if (err){ 
      console.log(`Status update failed ${err}`);
    }
    else{
      Updates.findOne({ username: username })
      .then(user => {
        user.status = "SURVIVED";
        user.save()
        .then(doc => {
          res.status(200).json({
            message: `Survived message posted successfully`
          })
          console.log(`Status Update sent and data update successful`)
        })
        .catch(err => {
          console.log(`User data update failed. Error occurred ${err}`)
          res.status(500).json({
            error: `An error {err} occurred`
          })
        })
      }).catch(err => {
        res.status(400).json({
          message: `An error ${err} occurred`
        })
        console.log(`User not found ${err}`);
      });
    }
  });
}


router.post('/', async (req, res)=> {
  const { username, saved, access_token, access_token_secret } = req.body;
  if (access_token) token.access_token = access_token;
  if (access_token_secret) token.access_token_secret = access_token_secret;

  if (saved === "true"){
    await postSurvived(username, res);
  }
  else{
    await postSos(username, res);
    const time = 1000 * 3600;
    const sendMia = setTimeout(postMia, time, username);
    sendMia;
  }
});

module.exports = router;