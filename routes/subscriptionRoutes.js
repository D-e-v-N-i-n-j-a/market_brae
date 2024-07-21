// routes/subscriptionRoutes.js

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateUserToken } = require('../middleware/authMiddleWare');


router.post('/subscribe',authenticateUserToken, subscriptionController.initiateSubscription);
router.get('/verify-subscription',authenticateUserToken, subscriptionController.verifySubscription);

module.exports = router;
