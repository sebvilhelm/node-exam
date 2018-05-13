const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { User, Sequelize } = require('../models');
const mail = require('../handlers/mail');

const $ = Sequelize.Op;

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "filetype isn't allowed" }, false);
    }
  },
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.uploadImage = multer(multerOptions).single('photo');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo
    .cover(500, 500)
    .quality(80)
    .write(`./public/uploads/users/${req.body.photo}`);
  next();
};

exports.validateUser = async (req, res, next) => {
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
  await mail.send({ user });
  next();
};

exports.userList = async (req, res) => {
  const users = await User.findAll({
    /* where: {
      id: { [$.ne]: req.user.id },
    }, */
    attributes: ['id', 'name', 'photo'],
  });
  res.render('userList', { title: 'Users List', users });
};

exports.sendMail = async (req, res) => {
  await mail.send();
  res.redirect('/');
};

exports.apiShowUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
  res.json(users);
};
