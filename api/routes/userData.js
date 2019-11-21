const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/checkAuth');

router.post('/', (req, res) => {
  const { username, access_token, access_token_secret } = req.body;
  User.find({username})
  .then(doc => {
    if (doc.length >= 1){
      console.log(`User exists`)
      res.status(409).json({
        message: 'User data already exists'
      });
    }else{
      const user = new User({
        username,
        access_token,
        access_token_secret
      });
      console.log(`User data created`)
      user.save()
      .then(saved => {
        res.status(201).json({
          message: `User data stored successfully`
        })
        console.log(`User data stored successfully`)
      })
      .catch(err => {
        res.status(500).json({
          error: `An error ${err} occurred`
        });
        console.log(`An error occurred ${err}, User data not stored`);
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
    console.log(`An error ${err} occurred, `);
  });
});


module.exports = router;