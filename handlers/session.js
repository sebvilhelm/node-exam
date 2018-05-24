module.exports = require('express-session')({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
});
