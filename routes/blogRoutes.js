// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const { authenticateAdminToken, authenticateUserToken } = require('../middleware/authMiddleWare');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/create', authenticateAdminToken, upload.single('image'), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.post('/comment', authenticateUserToken, blogController.addComment);

module.exports = router;
