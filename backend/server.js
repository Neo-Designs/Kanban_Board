/**
 * Assigned to: James (Server Core & Config)
 * Description: HTTP server bootstrap with Socket.io real-time engine integration.
 */
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { config } from './config/env.js';

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Provide io instance to Express routes & controllers
app.set('io', io);

// Socket.io connection handlers
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Join a board-specific collaborative room
  socket.on('board:join', (boardId) => {
    socket.join(`board:${boardId}`);
    console.log(`[Socket.io] Socket ${socket.id} joined room board:${boardId}`);
  });

  // Leave a board-specific room
  socket.on('board:leave', (boardId) => {
    socket.leave(`board:${boardId}`);
    console.log(`[Socket.io] Socket ${socket.id} left room board:${boardId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 SyncBoard Server running on port ${config.port}`);
  console.log(`⚙️  Environment: ${config.nodeEnv}`);
  console.log(`📡 Socket.io real-time engine active`);
  console.log(`=========================================`);
});

export { server, io };
