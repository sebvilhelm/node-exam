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
    password: {
      type: dataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return User;
};
