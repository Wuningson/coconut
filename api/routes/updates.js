const express = require('express');
const router = express.Router();
const Updates = require('../models/Updates');
const checkAuth = require('../middleware/checkAuth');

router.get('/sos', checkAuth, (req, res) => {
  Updates.find({ status : "SOS" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    })
  })
})

router.get('/survived', checkAuth, (req, res) => {
  Updates.find({ status : "SURVIVED" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    })
  })
})


router.get('/mia', checkAuth, (req, res) => {
  Updates.find({ status : "MIA" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    })
  })
})

module.exports = router;