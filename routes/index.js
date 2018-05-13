const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.uploadImage,
  userController.validateUser,
  catchErrors(userController.resizeImage),
  // Check if the user already exists in the database
  catchErrors(userController.registerUser),
  authController.login
);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/mail', catchErrors(userController.sendMail));

module.exports = router;
