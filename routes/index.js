const express = require('express');
const router = express.Router();

// autentikasi
const authController = require('../controllers/user.js');
const validate = require('../middleware/validate.js');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/whoami', validate, authController.whoami);

module.exports = router;