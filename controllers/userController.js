const { User } = require('../models');
const mail = require('../handlers/mail');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.validateUser = async (req, res, next) => {
  // Move all the validation out of the model and into here
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply your full name').notEmpty();
  req.checkBody('email', 'You must supply a valid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_subaddress: true,
    gmail_remove_dots: false,
    remove_extension: false,
  });
  req.sanitizeBody('phoneNumber');
  req.checkBody('phoneNumber', 'Please enter a valid danish phone number').isNumeric();
  req.checkBody('password', 'Please enter a password').notEmpty();
  req.checkBody('password-confirm', 'Please confirm your password').notEmpty();
  req.checkBody('password-confirm', "Passwords doesn't match").equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
};

exports.registerUser = async (req, res, next) => {
  const user = new User(req.body);
  await User.register(user, req.body.password);
  next();
};

exports.sendMail = async (req, res) => {
  await mail.send();
  res.redirect('/');
};
