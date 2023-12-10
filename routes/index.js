const express = require('express');
const router = express.Router();

// autentikasi
const userController = require('../controllers/user.js');
const validate = require('../middleware/validate.js');
const isAdmin = require('../middleware/is_admin.js');
router.post('/register', userController.register); // ok
router.post('/login', userController.login); // ok
router.get('/whoami', validate, userController.whoami); // ok

// attendant
router.get('/attendants', validate, userController.getAttendants); // ok

// location
const locationController = require('../controllers/location.js');
router.post('/locations', validate, isAdmin, locationController.create); // ok
router.get('/locations', validate, locationController.list); // ok
router.get('/locations/:id', validate, locationController.detail);

// transaksi
const transactionController = require('../controllers/transaction.js');
router.get('/attendants/:user_id/pay', transactionController.renderCheckoutPage);
router.post('/attendants/:user_id/pay', transactionController.createTransaction);
router.get('/attendants/:user_id/analytics', validate, transactionController.analytics);

module.exports = router;