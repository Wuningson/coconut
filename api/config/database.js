const mongoose = require('mongoose');
const db = process.env.mongoURI;

const connectDb = async() => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    })
    console.log('Connected to database');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDb;