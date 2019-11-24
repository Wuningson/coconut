const mongooose = require('mongoose');

const updatesSchema = new mongooose.Schema({
  username:{
    type: String,
    required: true,
  },
  displayName:{
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true
  },
  time:{
    type: String,
    required: true,
  },
  location:{
    type: String,
  }
});

module.exports = mongooose.model('Updates', updatesSchema);