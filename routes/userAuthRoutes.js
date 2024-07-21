// routes/userAuthRoutes.js

const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.post('/verify-otp', userAuthController.verifyOtp);

module.exports = router;
