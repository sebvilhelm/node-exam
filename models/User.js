const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const schemaOptions = {
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
      },
      phoneNumber: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
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
    },
    schemaOptions
  );

  User.beforeCreate(async user => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  User.findUserByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.register = function(user) {
    return new Promise(async (resolve, reject) => {
      try {
        /* Is this neccessary??? */
        const existingUser = await this.findOne({ where: { id: user.id } });
        if (existingUser) {
          reject();
        }
        /* Probably not */

        // user has to already be instantiated
        const createdUser = await user.save();
        resolve(createdUser);
      } catch (err) {
        reject(err);
      }
    });
  };

  User.authenticate = function() {
    return async (email, password, done) => {
      try {
        const user = await this.findUserByEmail(email);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        console.log(err);
        return done(err, undefined);
      }
    };
  };

  User.serializeUser = function() {
    return (user, done) => {
      done(null, user.id);
    };
  };

  User.deserializeUser = function() {
    return async (id, done) => {
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
    return new LocalStrategy(
      { usernameField: 'email', passwordField: 'password', session: 'true' },
      this.authenticate()
    );
  };

  return User;
};
