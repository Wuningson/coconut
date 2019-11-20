const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  access_token_secret:{
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', userSchema);