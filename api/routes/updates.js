const express = require('express');
const router = express.Router();
const Updates = require('../models/Updates');
const checkAuth = require('../middleware/checkAuth');

router.get('/sos', (req, res) => {
  Updates.find({ status : "SOS" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
    console.log(`Sos updates sent`);
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    })
    console.log(`An error occurred ${err}`);
  })
})

router.get('/survived', (req, res) => {
  Updates.find({ status : "SURVIVED" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
    console.log(`survived updates sent`);
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    });
    console.log(`An error occurred ${err}`);
  })
})


router.get('/mia', (req, res) => {
  Updates.find({ status : "MIA" })
  .then(doc => {
    res.status(200).json({
      data : doc
    });
    console.log(`mia updates sent`);
  })
  .catch(err => {
    res.status(500).json({
      message: `An error occurred ${err}`
    });
    console.log(`An error occurred ${err}`);
  });
})

module.exports = router;