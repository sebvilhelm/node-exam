const express = require('express');
const { catchErrors } = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', catchErrors(userController.addUser));
router.get('/users', catchErrors(userController.getUsers));

router.get('/login', userController.loginForm);
router.post('/login', userController.login);

module.exports = router;
