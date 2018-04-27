const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const options = {
  timestamps: false,
};

/* Alternative to no timestamps
const options = {
  timestamps: true,
  createdAt: false,
  paranoid: true
};
*/

module.exports = (sequelize, dataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
    },
    options
  );

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

        // user has to already be instantiated
        const createdUser = await user.save();
        resolve(createdUser);
      } catch (err) {
        reject(err);
      }
    });
  };

  User.authenticate = async function(email, password, done) {
    try {
      const user = await this.findOne({ where: { email } });
      const passwordMatch = await bcrypt.compare(password, user.hash);
      if (passwordMatch) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, undefined);
    }
  };

  User.serializeUser = function() {
    return function(user, done) {
      done(null, user.id);
    };
  };

  User.deserializeUser = function() {
    return async function(id, done) {
      try {
        const user = await this.findById(id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        done(err, undefined);
      }
    };
  };

  // For initializing passport strategy
  User.createStrategy = function() {
    return new LocalStrategy({ usernameField: 'email', passwordField: 'hash', session: 'true' }, this.authenticate);
  };

  return User;
};
