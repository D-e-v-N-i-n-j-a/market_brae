const express = require('express');
const {
  initiateSubscription,
  verifySubscription,
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscriptionController');
const { userMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/initiate', userMiddleware, initiateSubscription);
router.get('/verify', userMiddleware, verifySubscription);

// Admin routes
router.post('/admin/create', adminMiddleware, createSubscription);
router.get('/admin', adminMiddleware, getSubscriptions);
router.put('/admin/update', adminMiddleware, updateSubscription);
router.delete('/admin/delete/:subscriptionId', adminMiddleware, deleteSubscription);

module.exports = router;
