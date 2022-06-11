const express = require('express'),
      xss = require('xss-clean'),
      mongoSanitize = require('express-mongo-sanitize'),
      cors = require('cors'),
      routes = require('./routes');

const app = express();

//setting view engine to ejs
app.set("view engine", "ejs");

// serving static files in express
app.use(express.static('public'));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    res.send('Not found sorry');
});

module.exports = app;