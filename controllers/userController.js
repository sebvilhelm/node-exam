// const User = require('../models/User');
const { User } = require('../models');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.addUser = async (req, res) => {
  const user = Object.assign(req.body, {});
  console.log(user);
  // await User.create(req.body);
  res.redirect('/register');
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
