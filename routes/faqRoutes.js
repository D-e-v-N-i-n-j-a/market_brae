// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { authenticateAdminToken } = require('../middleware/authMiddleWare');

router.post('/create', authenticateAdminToken, faqController.createFAQ);
router.get('/', faqController.getFAQs);
router.delete('/:id', authenticateAdminToken, faqController.deleteFAQ);

module.exports = router;
