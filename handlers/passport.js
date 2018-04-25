const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport, User) => {
  passport.use(
    'local-signup',
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (req, done) => {
      generateHash = password => bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);

      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          done(null, false, { message: 'There is already a user with that email' });
        } else (
          
        )
      });
    })
  );
};
