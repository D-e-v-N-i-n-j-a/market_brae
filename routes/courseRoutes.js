
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
import { authenticateAdminToken } from '../middleware/authMiddleWare';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

router.post('/create',authenticateAdminToken, courseController.createCourse);
router.post('/add-material', authenticateAdminToken, upload.single('file'), courseController.addCourseMaterial);
router.get('/',authenticateAdminToken, courseController.getCourses);
router.post('/like',authenticateAdminToken, courseController.likeCourse);
router.post('/comment',authenticateAdminToken, courseController.addComment);

module.exports = router;
