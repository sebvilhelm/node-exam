const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const {
        name,
        emails: [{ value: email }],
      } = profile;
      const user = new User({
        name: `${name.givenName} ${name.familyName}`,
        email,
      });
      console.log(user);
      done(null, {});
    }
  )
);
