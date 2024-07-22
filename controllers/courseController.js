const { Course, CourseMaterial, Like, Comment, Admin } = require('../models');
const multer = require('multer');
const { createCourseSchema, addCourseMaterialSchema, likeCourseSchema, addCommentSchema } = require('../validations/courseValidation');

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
  const { error } = createCourseSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, adminId } = req.body;

  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const coverImageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
    const course = await Course.create({ title, description, adminId, coverImageUrl });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCourseMaterial = async (req, res) => {
  const { error } = addCourseMaterialSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { courseId, type } = req.body;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const material = await CourseMaterial.create({ type, fileUrl, courseId });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [CourseMaterial, Like, Comment,Admin]
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likeCourse = async (req, res) => {
  const { error } = likeCourseSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { courseId, userId } = req.body;
    const like = await Like.create({ courseId, userId });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { error } = addCommentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { content, courseId, userId } = req.body;
    const comment = await Comment.create({ content, courseId, userId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
