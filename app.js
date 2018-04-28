const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const { User } = require('./models');
const routes = require('./routes');
const helpers = require('./helpers');
require('./handlers/passport');

const errorHandler = require('./handlers/errorHandler');

const app = express();

// Set views folder and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Expose variable to all templates
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user;
  res.locals.currentPath = req.path;
  next();
});

// Set up routes
app.use('/', routes);

// Pretty Print an error on the front end, if all else fails
app.use(errorHandler.displayError);

module.exports = app;
