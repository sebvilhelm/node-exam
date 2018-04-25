// const User = require('../models/User');
const { User } = require('../models');

exports.addUser = async (req, res) => {
  const user = await User.create({
    firstName: 'Sylvester',
    lastName: 'Loller',
  });
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
