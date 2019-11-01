const express = require('express');
const app = express();
const sos = require('./routes/sos');
const mia = require('./routes/mia');

app.use(express.urlencoded({extended: false}));

app.use('/sos', sos);

app.use('/mia', mia);

const port = 4444;

app.listen(port, ()=> console.log(`Server started at port ${port}`));

module.exports = app;