const bcrypt = require('bcrypt');

module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email',
        },
      },
    },
    phoneNumber: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'Phonenumbers can only contain numbers',
        },
        len: {
          args: [8, 8],
          msg: 'Please enter a valid, danish phone number',
        },
      },
    },
    hash: {
      type: dataTypes.STRING,
      allowNull: false,
    },
  });

  User.register = function(user, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const existingUser = await this.findOne({ where: { id: user.id } });
        if (existingUser) {
          reject();
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        user.hash = hash;

        const createdUser = await user.save();
        resolve(createdUser);
      } catch (err) {
        reject(err);
      }
    });
  };

  return User;
};
