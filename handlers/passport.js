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
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const {
          name: { familyName, givenName },
          emails: [{ value: email }],
          id: googleId,
          photos: [{ value: photo }],
        } = profile;

        const existingUser = await User.findByEmail(email);

        if (existingUser) {
          done(null, existingUser);
          return;
        }

        const user = await User.create({ name: `${givenName} ${familyName}`, email, photo, googleId, type: 'google' });

        done(null, user);
      } catch (e) {
        done(e, {});
      }
    }
  )
);
