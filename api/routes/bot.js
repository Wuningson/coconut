const express = require('express');
const router = express.Router();
const Twit = require('twit');
const Updates = require('../models/Updates');
const getCurrentDateTime = require('./utils');
const checkAuth = require('../middleware/checkAuth');
const User = require('../models/User');
const degToDms = require('./degToDms');

const postSos = (username, res, T, lng, lt) => {
  const lat = degToDms(Number(lt));
  const long = degToDms(Number(lng));
  const time = getCurrentDateTime();
  const location = `google.com/maps/search/${long}${lat}`;
  console.log(long);
  console.log(lat);
  console.log(location);
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives on ${time}. \nLocation url: ${location}`}, (err, data, response) => {
    if (err){
      console.log(err);
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
    }else{
      Updates.findOne({ username })
      .then(update => {
        update.status = "SOS";
        update.time = time;
        update.location = location;
        update.save().then(doc => {
          console.log(`Status update sent Successfully and stored in database`);
          res.status(200).json({
            message: `Status update sent and status updated to SOS`
          })
        })
      })
      .catch(err => {
        console.log(`Status does not exist for this user`);
        const status = "SOS";
        const displayName = data.user.name;
        console.log(`status is ${status}, time created is ${time}, displayName is ${displayName}`)
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
      })
    }
  });
}


const postMia = async (username, T, lng, lt) => {
  Updates.findOne({username})
  .then(update => {
    const long = degToDms(Number(lng));
    const lat = degToDms(Number(lt));
    const location = `google.com/maps/search/${long}${lat}`;
    console.log(`Update found`);
    const time = getCurrentDateTime()
    T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, ${time}. \nLast known location URL: ${location}`}, (err, data, response) => {
      if (err) console.log(`Status update failed ${err}`);
      else{
        update.status = "MIA";
        update.save().then(doc => console.log(`Status Update sent and data update successful`)).catch(err => `User data update failed. Error occurred ${err}`)
      }
    })
    })
    .catch(err => {
    console.log(`User not found`);
  });
}


const postSurvived = async (username, res, T) => {
  Updates.findOne({ username })
    .then(update => {
      console.log(`Update found`)
      const time = getCurrentDateTime()
      T.post('statuses/update', {status: `@${username} has survived SARS on ${time}`}, (err, data, response) => {
        if (err){ 
          console.log(`Status update failed ${err}`);
        }
        else{
          update.status = "SURVIVED";
          update.save()
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
      })
    }).catch(err => {
        console.log(`User not found ${err}`);
        res.status(400).json({
          message: `An error ${err} occurred`
        });
    });
}


router.post('/', async (req, res)=> {
  const token = require('../../config/token');
  const { username, saved, lng, lt } = req.body;

  User.findOne({username}).then(async user => {
    console.log(`User found`);
    token.access_token = user.access_token;
    token.access_token_secret = user.access_token_secret;

    const T = new Twit(token);
  
    if (saved == "true"){
      await postSurvived(username, res, T);
    }else{
      await postSos(username, res, T, lng, lt);
      const setTime = 1000 * 360;
      const sendMia = setTimeout(postMia, setTime, username, T, lng, lt);
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

