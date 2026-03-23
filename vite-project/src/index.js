import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  
  socket.on('join room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });


  socket.on('chat message', ({ roomCode, message }) => {
    console.log(`Message to room ${roomCode}: ${message}`);
    // Send to everyone in that room (including sender)
    io.to(roomCode).emit('chat message', message);
  });


  // broadcast to all connected clients except those in the room
  //io.except('some room').emit('hello', 'world');

  // leave the room
  //socket.leave('some room');
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});