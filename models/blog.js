// models/blog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admins', // refers to table name
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'blogs',
  timestamps: true
});

Blog.associate = (models) => {
  Blog.belongsTo(models.Admin, { foreignKey: 'adminId' });
  Blog.hasMany(models.Comment, { foreignKey: 'blogId', as: 'comments' });
};

module.exports = Blog;
