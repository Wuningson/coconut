const express = require('express');
const app = express();
const bot = require('./api/routes/bot');
const Db = require('./config/database');
const updates = require('./api/routes/updates');
const userData = require('./api/routes/userData');
const history = require('./api/routes/history');

Db();

app.use(express.json({extended: false}));

app.use('/bot', bot);

app.use('/updates', updates);

app.use('/userdata', userData);

app.use('/history', history);

const port = process.env.PORT || 4444;

app.listen(port, ()=> console.log(`Server started at port ${port}`));

module.exports = app;