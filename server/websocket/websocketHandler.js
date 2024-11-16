const WebSocket = require('ws');

const clients = new Map();

function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

function broadcastUserStatus(userId, status) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'userStatus',
        userId: userId,
        status: status,
      }));
    }
  });
}

function handleWebSocketConnection(wss) {
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'ws://localhost:5000');
    const token = url.searchParams.get('token');
    const userId = token || generateUserId();

    // Store client connection
    clients.set(userId, { ws, user: { id: userId } });

    // Notify the client of connection success
    ws.send(JSON.stringify({
      type: 'connection',
      userId: userId,
      message: 'Connected to chat server',
    }));

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);

        switch (message.type) {
          case 'chat': {
            const recipientClient = clients.get(message.recipientId);
            if (recipientClient?.ws.readyState === WebSocket.OPEN) {
              recipientClient.ws.send(JSON.stringify({
                type: 'chat',
                senderId: userId,
                message: message.content,
                timestamp: new Date().toISOString(),
              }));
            }
            ws.send(JSON.stringify({
              type: 'messageDelivered',
              messageId: message.id,
              timestamp: new Date().toISOString(),
            }));
            break;
          }

          case 'typing': {
            const typingRecipient = clients.get(message.recipientId);
            if (typingRecipient?.ws.readyState === WebSocket.OPEN) {
              typingRecipient.ws.send(JSON.stringify({
                type: 'typing',
                senderId: userId,
                isTyping: message.isTyping,
              }));
            }
            break;
          }

          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Error processing message' }));
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
      broadcastUserStatus(userId, 'offline');
    });
  });
}

module.exports = { handleWebSocketConnection };