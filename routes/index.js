const express = require('express');
const { catchErrors } = require('../handlers/errorHandler');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Home' }));

router.get('/register', userController.registerForm);
router.post('/register', userController.validateUser, catchErrors(userController.addUser));
router.get('/users', catchErrors(userController.getUsers));

router.get('/login', userController.loginForm);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
