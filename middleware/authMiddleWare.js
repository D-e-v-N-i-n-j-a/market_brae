// middleware/auth.js

const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');

// Admin authentication middleware
const authenticateAdminToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findByPk(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// User authentication middleware
const authenticateUserToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateAdminToken, authenticateUserToken };
