// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
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
  coverImageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'courses',
  timestamps: true
});

Course.associate = (models) => {
  Course.belongsTo(models.Admin, { foreignKey: 'adminId' });
  Course.hasMany(models.CourseMaterial, { foreignKey: 'courseId' });
  Course.hasMany(models.Like, { foreignKey: 'courseId' });
  Course.hasMany(models.Comment, { foreignKey: 'courseId' });
};

module.exports = Course;
