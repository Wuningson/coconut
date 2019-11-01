const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);

router.post('/', (req, res)=> {
  const lat = req.body.lat;
  const long = req.body.long;
  T.post('statuses/update', {status: `@${username} is about to be picked up by SARS operatives at this location`, geo: {"type": "Point", "coordinates": [lat, long]}}, (err, data, response)=> {
    if (err){
      console.log(`Something went wrong ${err}`);
      res.status(500).json({
        error: err
      })
    }else {
      console.log(`That went well`);
      res.status(200).json({
        message: 'Post status success'
      })
    }
  })
});

module.exports = router;

