const express = require('express');
const { isAuthenticated, isLoggedin } = require('../controllers/auth');
const { completePayment } = require('../controllers/payment');
const router = express.Router();

router.post('/payment', completePayment);

module.exports = router;
