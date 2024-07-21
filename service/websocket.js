// websocket.js

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { GroupMessage } = require('./models');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, req) => {
  const token = req.headers['sec-websocket-protocol'];
  if (!token) {
    ws.close();
    return;
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    ws.close();
    return;
  }

  ws.on('message', async (message) => {
    const { groupId, content } = JSON.parse(message);

    const newMessage = await GroupMessage.create({
      groupId,
      userId: user.id,
      content
    });

    // Broadcast the new message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newMessage));
      }
    });
  });
});

module.exports = wss;
