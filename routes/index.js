const express = require('express');
const { catchErrors } = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/register', userController.registerForm);
router.post('/register', catchErrors(userController.addUser));
router.get('/users', catchErrors(userController.getUsers));

router.get('/login', userController.loginForm);
router.post('/login', userController.login);

router.get('/test', (req, res) => {
  if (req.isAuthenticated()) {
    req.flash('info', 'You are authenticated!');
  }
  res.render('layout', { title: 'Test' });
});

module.exports = router;
