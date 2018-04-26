const passport = require('passport');
const { User } = require('../models');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.addUser = async (req, res) => {
  const user = new User(req.body);
  const createdUser = await User.register(user, req.body.password);
  console.log(createdUser);
  res.redirect('/users');
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
