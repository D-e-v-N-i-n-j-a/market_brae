const express = require('express');
const { sendOtp, verifyOtpAndRegister, login, adminLogin, adminRegistration,uploadProfilePicture } = require('../controllers/authController');

const router = express.Router();
const { upload } = require('../config/gridfs');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndRegister);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/admin/register', adminRegistration);
router.post('/upload-profile-picture', upload.single('file'), uploadProfilePicture);

module.exports = router;
