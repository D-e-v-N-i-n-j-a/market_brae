// controllers/blogController.js
const { Blog, Comment, Admin,User } = require('../models');
const multer = require('multer');
const Joi = require('joi');

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

// Validation schemas
const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  adminId: Joi.number().required()
});

const addCommentSchema = Joi.object({
  text: Joi.string().required(),
  blogId: Joi.number().required(),
  userId: Joi.number().required()
});

exports.createBlog = async (req, res) => {
  const { error } = createBlogSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { title, description, adminId } = req.body;

  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/${req.file.path}` : null;
    const blog = await Blog.create({ title, description, imageUrl, adminId });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstname', 'lastname', 'email'] // specify the fields you want to include
            }
          ]
        }
      ]
    });
    res.status(200).json(blogs);
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
    const { text, blogId, userId } = req.body;
    const comment = await Comment.create({ text, blogId, userId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
