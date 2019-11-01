const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);

router.post('/', (req, res) => {
  const username = req.body.username;
  T.post('statuses/update', {status: `@${username} has survived SARS`}, (err, data, response) => {
    if (err){
      res.status(500).json({
        message: `An error occurred while sending your update, ${err}`
      });
    }else{
      console.log(data);
      res.status(200).json({
        message: `Status update ${data} sent successfully`
      });
    }
  });
})

module.exports = router;