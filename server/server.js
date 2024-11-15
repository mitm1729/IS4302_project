// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;

// Store active connections with their user information
const clients = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  // Extract token from query string
  const url = new URL(req.url, 'ws://localhost:5000');
  const token = url.searchParams.get('token');
  
  // You should verify the token here and get the user ID
  // For now, we'll use a placeholder userId
  const userId = token || generateUserId();
  
  // Store client connection
  clients.set(userId, { ws, user: { id: userId } });

  // Send connection confirmation
  ws.send(JSON.stringify({
    type: 'connection',
    userId: userId,
    message: 'Connected to chat server'
  }));

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      
      // Handle different message types
      switch (message.type) {
        case 'chat':
          // Store message in database (you'll need to implement this)
          // const savedMessage = await MessageModel.create({...})
          
          // Broadcast to recipient
          const recipientClient = clients.get(message.recipientId);
          if (recipientClient?.ws.readyState === WebSocket.OPEN) {
            recipientClient.ws.send(JSON.stringify({
              type: 'chat',
              senderId: userId,
              message: message.content,
              timestamp: new Date().toISOString()
            }));
          }
          
          // Confirm message delivery to sender
          ws.send(JSON.stringify({
            type: 'messageDelivered',
            messageId: message.id,
            timestamp: new Date().toISOString()
          }));
          break;

        case 'typing':
          const typingRecipient = clients.get(message.recipientId);
          if (typingRecipient?.ws.readyState === WebSocket.OPEN) {
            typingRecipient.ws.send(JSON.stringify({
              type: 'typing',
              senderId: userId,
              isTyping: message.isTyping
            }));
          }
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Error processing message'
      }));
    }
  });

  ws.on('close', () => {
    clients.delete(userId);
    // Broadcast user offline status if needed
    broadcastUserStatus(userId, 'offline');
  });
});

function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

function broadcastUserStatus(userId, status) {
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'userStatus',
        userId: userId,
        status: status
      }));
    }
  });
}

// Express middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});