const express = require('express');
const router = express.Router();
const Twit = require('twit');
const Updates = require('../models/Updates');
const getCurrentDateTime = require('./utils');
const checkAuth = require('../middleware/checkAuth');
const User = require('../models/User');
const degToDms = require('./degToDms');

const postSos = (username, res, T, long, lat) => {
  const long = degToDms(long);
  const lat = degToDms(lat);
  const location = `google.com/maps/search/${long} ${lat}`;
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives on ${time}. Location url: ${location}`}, (err, data, response) => {
    if (err){
      console.log(err);
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
    }else{
      console.log(`Status update sent successfully`);
      const status = "SOS";
      const time = getCurrentDateTime();
      const displayName = data.user.name;
      console.log(`status is ${status}, time created is ${createdTime}, displayName is ${displayName}`)
      const update = new Updates({
        username,
        displayName,
        status,
        time,
        location
      });
      update.save().then(doc => console.log(doc)).catch(err => console.log(err));
      res.status(200).json({
        message: `Status update sent successfully`
      });
    }
  });
}


const postMia = async (username, T) => {
  Updates.findOne({username}).then(user => {
    console.log(`User found`);
    const time = getCurrentDateTime()
    T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, ${time}`}, (err, data, response) => {
      if (err) console.log(`Status update failed ${err}`);
      else{
        user.status = "MIA";
        user.save().then(doc => console.log(`Status Update sent and data update successful`)).catch(err => `User data update failed. Error occurred ${err}`)
      }
    }).catch(err => {
    console.log(`User not found`);
  });
  });
}


const postSurvived = async (username, res, T) => {
  Updates.findOne({ username: username })
    .then(user => {
      const time = getCurrentDateTime()
      T.post('statuses/update', {status: `@${username} has survived SARS on ${time}`}, (err, data, response) => {
        if (err){ 
          console.log(`Status update failed ${err}`);
        }
        else{
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
            });
          })
        }
      }).catch(err => {
        console.log(`User not found ${err}`);
        res.status(400).json({
          message: `An error ${err} occurred`
        });
      });
  })
}


router.post('/', async (req, res)=> {
  const token = require('../../config/token');
  const { username, saved, long, lat } = req.body;

  User.findOne({username}).then(async user => {
    console.log(`User found`);
    token.access_token = user.access_token;
    token.access_token_secret = user.access_token_secret;

    const T = new Twit(token);
  
    if (saved == "true"){
      await postSurvived(username, res, T);
    }else{
      await postSos(username, res, T, long, lat);
      const setTime = 1000 * 3600;
      const sendMia = setTimeout(postMia, setTime, username, T);
      sendMia;
    }
  }).catch(err => {
    console.log(`User does not exist ${err}`);
    res.status(404).json({
      error: `User does not exist ${err}`
    });
  });
});

module.exports = router;

