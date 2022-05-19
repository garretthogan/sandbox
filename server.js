const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const shortid = require('shortid');

app.use(express.static('dist'));

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('join room', (code) => {
    const playerId = shortid.generate();
    console.log('request to join room: ', code);
    socket.join(`${code}`);
    io.to(`${code}`).emit('player joined', playerId);
  });

  socket.on('update pos', (data) => {
    console.log(`Player: ${data.id} moved to ${data.position.x}:${data.position.y}:${data.position.z}`);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
