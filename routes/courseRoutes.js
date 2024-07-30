const express = require('express');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  uploadCourseMaterials
} = require('../controllers/courseController');
const { userMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:courseId', getCourse);

// Admin routes
router.post('/create', adminMiddleware, createCourse);
router.put('/update/:courseId', adminMiddleware, updateCourse);
router.delete('/delete/:courseId', adminMiddleware, deleteCourse);
router.post('/upload/:courseId/materials', adminMiddleware, uploadCourseMaterials);

module.exports = router;
