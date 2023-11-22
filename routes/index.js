const express = require('express');
const router = express.Router();

// autentikasi
const userController = require('../controllers/user.js');
const validate = require('../middleware/validate.js');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/whoami', validate, userController.whoami);

// attendant
router.get('/attendants', userController.getAttendants);

// location
const locationController = require('../controllers/location.js');
router.post('/locations', locationController.create);
router.get('/locations', locationController.list);
router.get('/locations/:id', locationController.detail);

module.exports = router;