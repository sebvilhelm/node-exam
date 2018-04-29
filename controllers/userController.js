const { User } = require('../models');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.validateUser = async (req, res, next) => {
  // Move all the validation out of the model and into here
  req.sanitizeBody('firstName');
  req.checkBody('firstName', 'You must supply your first name').notEmpty();
  req.sanitizeBody('lastName');
  req.checkBody('lastName', 'You must supply your last name').notEmpty();
  req.checkBody('email', 'You must supply a valid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_subaddress: true,
    gmail_remove_dots: false,
    remove_extension: false,
  });
  req.sanitizeBody('phoneNumber');
  req.checkBody('phoneNumber', 'Please enter a valid danish phone number').isNumeric();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    return res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
  }
  next();
};

exports.registerUser = async (req, res, next) => {
  const user = new User(req.body);
  await User.register(user, req.body.password);
  next();
};
