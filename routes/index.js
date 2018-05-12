const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/register', userController.registerForm);
router.post('/register', userController.validateUser, catchErrors(userController.registerUser), authController.login);

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

router.post('/chat/:id', chatController.addMessage);

router.get('/users', authController.isLoggedIn, catchErrors(userController.userList));

module.exports = router;
