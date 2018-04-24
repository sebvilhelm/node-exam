const User = require('../models/User');

exports.addUser = async (req, res) => {
  const user = await User.query().insertGraph({
    firstName: 'Sylvester',
    lastName: 'Loller',
    email: 'sly@example.com',
    phoneNumber: '31244148',
    password: 'password',
  });
  res.json(user);
};

exports.getUsers = async (req, res) => {
  const users = await User.query();
  res.json(users);
};
