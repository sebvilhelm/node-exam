const passport = require('passport');
const { User } = require('../models');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.login = passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
});

exports.addUser = async (req, res) => {
  const user = new User(req.body);
  await User.register(user, req.body.password);
  res.redirect('/users');
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
