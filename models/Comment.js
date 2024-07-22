// models/comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'courses',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'blogs',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'comments',
  timestamps: true
});

Comment.associate = (models) => {
  Comment.belongsTo(models.Course, { foreignKey: 'courseId' });
  Comment.belongsTo(models.Blog, { foreignKey: 'blogId' });
  Comment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Comment;
