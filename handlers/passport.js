const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport, User) => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      if (user) {
        return done(null, user.get());
      }
      done(user.errors, null);
    });
  });
};
