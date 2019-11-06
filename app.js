const express = require('express');
const app = express();
const bot = require('./routes/bot');

app.use(express.json({extended: false}));

app.use('/bot', bot);

const port = process.env.PORT || 4444;

app.listen(port, ()=> console.log(`Server started at port ${port}`));

module.exports = app;