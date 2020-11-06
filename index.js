const express = require('express');
const  http = require('http');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

var passport = require('passport');
var config = require('./config');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

//Routes
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/users', users);

const hostname = 'localhost';
const port = 3000;
const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});