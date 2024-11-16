require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const WebSocket = require('ws');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const mailRoutes = require('./routes/mailRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');
const { handleWebSocketConnection } = require('./websocket/websocketHandler');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(bodyParser.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/chat', chatRoutes);

// Modularized WebSocket logic
handleWebSocketConnection(wss);

// Error handling middleware
// app.use(errorHandler);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});