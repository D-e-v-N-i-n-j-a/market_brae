// models/like.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
}, {
  tableName: 'likes',
  timestamps: true
});

Like.associate = (models) => {
  Like.belongsTo(models.Course, { foreignKey: 'courseId' });
};

module.exports = Like;
