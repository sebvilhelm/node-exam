const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.uploadImage,
  userController.validateUser,
  catchErrors(userController.CheckIfUserExists),
  catchErrors(userController.resizeImage),
  catchErrors(userController.registerUser),
  catchErrors(userController.sendVerificationSMS),
  userController.userCreated
);

router.get('/user-confirmation', userController.showConfirmation);

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post(
  '/chat',
  authController.isLoggedIn,
  catchErrors(chatController.channelExists),
  catchErrors(chatController.addChannel)
);
router.get('/chat/:id', authController.isLoggedIn, catchErrors(chatController.showChannel));

router.get('/chat', authController.isLoggedIn, chatController.getGlobalChat);

router.get('/users', authController.isLoggedIn, catchErrors(userController.userList));

router.get('/api/users', catchErrors(userController.apiShowUsers));

module.exports = router;
