const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const schemaOptions = {
  timestamps: false,
};

/* Alternative to no timestamps
const schemaOptions = {
  timestamps: true,
  createdAt: false,
  paranoid: true
};
*/

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name cannot be empty',
          },
        },
        // TODO: Set names to uppercase
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Email cannot be empty',
          },
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: 'Phone numbers can only contain numbers',
          },
          len: {
            args: [8, 8],
            msg: 'Please enter a valid, danish phone number',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },
      photo: {
        type: DataTypes.STRING,
      },
    },
    schemaOptions
  );

  User.hashPassword = async user => {
    user.password = await bcrypt.hash(user.password, 12);
  };

  User.beforeCreate(User.hashPassword);
  User.beforeUpdate(User.hashPassword);

  User.findUserByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.register = function(user) {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO: Handle if email is already in the system
        // but maybe not here? Probably controller

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

        if (!user) {
          done(null, false);
        }

        const passwordMatch = await bcrypt.compare(password, user.get('password'));
        if (passwordMatch) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, undefined);
      }
    };
  };

  User.serializeUser = function() {
    return (user, done) => {
      done(null, user.get('id'));
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
