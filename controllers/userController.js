// const User = require('../models/User');
const { User } = require('../models');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.addUser = async (req, res) => {
  /* const user = await User.create({
    firstName: 'Sylvester',
    lastName: 'Loller',
  }); */
  const user = await User.create(req.body);
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
