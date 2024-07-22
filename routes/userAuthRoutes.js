// routes/userAuthRoutes.js

const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');

router.post('/send-otp', userAuthController.sendOtp);
router.post('/verify-otp', userAuthController.verifyOtpAndRegister);
router.post('/login', userAuthController.login);
router.post('/admin/login',userAuthController.adminLogin)
router.post('/admin/register',userAuthController.adminRegistration)
module.exports = router;
