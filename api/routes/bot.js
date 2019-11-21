const express = require('express');
const router = express.Router();
const Twit = require('twit');
const Updates = require('../models/Updates');
const getCurrentDateTime = require('./utils');
const checkAuth = require('../middleware/checkAuth');
const User = require('../models/User');


const postSos = (username, res, T) => {
  const time = getCurrentDateTime()
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives at this location on ${time}`}, (err, data, response) => {
    if (err){
      console.log(err);
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
      
    }else{
      console.log(`Status update sent successfully`);
      const status = "SOS";
      const createdTime = time;
      const displayName = data.user.name;
      console.log(`status is ${status}, time created is ${createdTime}, displayName is ${displayName}`)
      const update = new Updates({
        username,
        displayName,
        status,
        time : createdTime,
      });
      update.save().then(doc => console.log(doc)).catch(err => console.log(err));
      res.status(200).json({
        message: `Status update sent successfully`
      });
    }
  });
}


const postMia = (username, T) => {
  const time = getCurrentDateTime()
  T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, ${time}`}, (err, data, response) => {
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


const postSurvived = async (username, res, T) => {
  const time = getCurrentDateTime()
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
  const token = require('../../config/token');
  const { username, saved } = req.body;

  User.findOne({username}).then(async user => {
    token.access_token = user.access_token;
    token.access_token_secret = user.access_token_secret;

    const T = new Twit(token);
  
    if (saved == "true"){
      await postSurvived(username, res, T);
    }else{
      await postSos(username, res, T);
      const setTime = 1000 * 36;
      const sendMia = setTimeout(postMia, setTime, username, T);
      sendMia;
    }
  }).catch(err => {
    res.status(404).json({
      error: `User does not exist ${err}`
    });
  });
});

module.exports = router;