// models/courseMaterial.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseMaterial = sequelize.define('CourseMaterial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'course_materials',
  timestamps: true
});

CourseMaterial.associate = (models) => {
  CourseMaterial.belongsTo(models.Course, { foreignKey: 'courseId' });
};

module.exports = CourseMaterial;
