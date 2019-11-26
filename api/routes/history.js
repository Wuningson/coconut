const express = require('express');
const router = express.Router();
const History = require('../models/History');

const getHistory = (History, getStatus, res) => {
  History.find({status: getStatus})
  .then(doc => {
    console.log(doc);
    res.status(200).json({
      data: doc
    });
  })
  .catch(err => {
    console.log(`Something went wrong ${err}`);
    res.status(500).json({
      error: err
    });
  });
} 

router.get('/sos', (req, res) => {
  getHistory(History, "SOS", res);
});

router.get('/mia', (req, res) => {
  getHistory(History, "MIA", res);
});

router.get('/survived', (req, res) => {
  getHistory(History, "SURVIVED", res);
})

module.exports = router;