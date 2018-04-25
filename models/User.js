module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
      type: dataTypes.STRING,
    },
    lastName: {
      type: dataTypes.STRING,
    },
  });

  return User;
};
