const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('History', historySchema);