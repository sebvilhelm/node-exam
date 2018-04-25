const express = require('express');
const { catchErrors } = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', catchErrors(userController.addUser));
router.get('/users', catchErrors(userController.getUsers));

module.exports = router;
