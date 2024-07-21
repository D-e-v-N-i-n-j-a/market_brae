
const { GroupChat, GroupMessage, User } = require('../models');

exports.createGroupChat = async (req, res) => {
  const { name } = req.body;
  const adminId = req.user.id;

  try {
    const groupChat = await GroupChat.create({ name, adminId });
    res.status(201).json(groupChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await GroupMessage.findAll({
      where: { groupId },
      include: [User]
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
 