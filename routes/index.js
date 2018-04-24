const express = require('express');
const { catchErrors } = require('../handlers/errorHandler');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', catchErrors(userController.addUser));
router.get('/users', catchErrors(userController.getUsers));

module.exports = router;
