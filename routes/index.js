const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/register', userController.registerForm);
router.post('/register', userController.validateUser, catchErrors(userController.registerUser), authController.login);

router.get('/login', userController.loginForm);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', (req, res) => res.redirect('/'));

module.exports = router;
