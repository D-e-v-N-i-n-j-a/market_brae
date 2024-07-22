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
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'course_materials',
  timestamps: true
});

CourseMaterial.associate = (models) => {
  CourseMaterial.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

};

module.exports = CourseMaterial;
