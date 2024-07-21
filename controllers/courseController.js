
const { Course, CourseMaterial, Like, Comment } = require('../models');
const multer = require('multer');

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

exports.createCourse = async (req, res) => {
  try {
    const { title, description, adminId } = req.body;
    const course = await Course.create({ title, description, adminId });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCourseMaterial = async (req, res) => {
  try {
    const { courseId, type } = req.body;
    const url = req.file.path;
    const material = await CourseMaterial.create({ type, url, courseId });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [CourseMaterial, Like, Comment]
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    const like = await Like.create({ courseId, userId });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, courseId, userId } = req.body;
    const comment = await Comment.create({ content, courseId, userId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
