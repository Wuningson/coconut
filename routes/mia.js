const express = require('express');
const router = express.Router();
const Twit = require('twit');
const config = require('../config/config');
const T = new Twit(config);
const axios = require('axios').default;


const action =(res, username, lat, long)=>{
  T.post('statuses/update', {status: `@${username} has not sent any update in the last hour, last location is shared below`, geo: {"type": "Point", "coordinates": [lat, long]}}, (err, data, response)=> {
    if (err){
      console.log(`Something went wrong ${err}`);
      res.status(500).json({
        error: err
      });
    }else {
      console.log(`That went well`);
      res.status(200).json({
        message: 'Post status success'
      });
    }
  })
}

router.post('/', (req, res)=> {
  const saved = req.body.saved;
  const lat = req.body.lat;
  const lng = req.body.long;
  const username = req.body.username;
  const time = 1000*30;
  const sendMia = setTimeout(action, time, res, username, lat, lng);
  sendMia;
  if (saved){
    clearTimeout()
    axios.post('/survived', {username})
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  }
});


module.exports = router;

