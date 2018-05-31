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
        // TODO: Set names to capitalized
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
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'local',
      },
      googleId: {
        type: DataTypes.STRING,
      },
    },
    schemaOptions
  );

  User.hashPassword = async user => {
    user.password = await bcrypt.hash(user.password, 12);
  };

  User.beforeCreate(async user => {
    if (user.password) {
      await User.hashPassword(user);
    }
  });
  User.beforeUpdate(async user => {
    if (user.password) {
      await User.hashPassword(user);
    }
  });

  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.register = function(user) {
    return new Promise(async (resolve, reject) => {
      try {
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
        const user = await this.findByEmail(email);

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
