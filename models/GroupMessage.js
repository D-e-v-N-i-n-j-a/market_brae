// models/GroupMessage.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const GroupChat = require('./GroupChat');
const User = require('./User');

const GroupMessage = sequelize.define('GroupMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: GroupChat,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'GroupMessage',
  tableName: 'group_messages',
  timestamps: true
});

GroupChat.hasMany(GroupMessage, { foreignKey: 'groupId' });
GroupMessage.belongsTo(GroupChat, { foreignKey: 'groupId' });
User.hasMany(GroupMessage, { foreignKey: 'userId' });
GroupMessage.belongsTo(User, { foreignKey: 'userId' });

module.exports = GroupMessage;
