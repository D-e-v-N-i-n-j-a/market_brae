// models/GroupChat.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./Admin');
const User = require('./User');

const GroupChat = sequelize.define('GroupChat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'GroupChat',
  tableName: 'group_chats',
  timestamps: true
});

Admin.hasMany(GroupChat, { foreignKey: 'adminId' });
GroupChat.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = GroupChat;