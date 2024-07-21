// routes/groupChatRoutes.js

const express = require('express');
const router = express.Router();
const groupChatController = require('../controllers/groupChatController');
const { authenticateAdminToken,authenticateUserToken } = require('../middleware/authMiddleWare');

router.post('/create', authenticateAdminToken, groupChatController.createGroupChat);
router.get('/messages/:groupId', authenticateUserToken, groupChatController.getGroupMessages);

module.exports = router;
