const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const shortid = require('shortid');

app.use(express.static('dist'));

const rooms = {};

let lastPos = { x: -6, y: 0, z: -4 }

io.on('connection', (socket) => {
  // support clearing out the last entry with perviousName
  socket.on('update player name', (name, playerId, roomKey) => {
    if(rooms[roomKey].players) {
      rooms[roomKey].players[playerId]['name'] = name;
    } else {
      rooms[roomKey]['players'] = { [`${playerId}`]: { name, playerId } };
    }

    console.log({name: rooms[roomKey].players[playerId]});
    io.to(roomKey).emit('player name updated', playerId, name);
  });

  socket.on('world generated', (matrices, roomKey) => {
    rooms[roomKey]['worldMatrix'] = matrices;
    io.to(roomKey).emit('update world matrix', matrices);
    console.log('world generated ', roomKey);
  });

  socket.on('create room', (name) => {
    const defaultName = 'GRET';
    const playerId = shortid.generate();
    const id = shortid.generate();
    const roomKey = `${name}:${id}`;
    rooms[roomKey] = { id, name, players: { } };
    socket.join(roomKey);
    console.log('ROOM CREATED: ', rooms[roomKey]);
    io.to(roomKey).emit('room created',roomKey, playerId, defaultName);
  });

  socket.on('join room', (roomKey) => {
    const defaultName = 'GRET';
    const playerId = shortid.generate();
    console.log('request to join room: ', roomKey);
    socket.join(roomKey);
    const nextPos = { x: lastPos.x + 5, y: lastPos.y, z: lastPos.z };
    rooms[roomKey].players[playerId] = { name: defaultName, playerId, position: nextPos }
    lastPos = nextPos;
    io.to(roomKey).emit('player joined', playerId, defaultName, roomKey, rooms[roomKey].players);
  });

  socket.on('move forward', (playerId, roomKey) => {
    const room = rooms[roomKey];
    const player = room.players[playerId];
    const pos = player.position;
    console.log('SERVER POS ', pos);
    player.position = { x: pos.x, y: pos.y, z: pos.z - 1 };

    io.to(roomKey).emit('player pos updated', playerId, player.position);
  });

  socket.on('update pos', (data) => {
    // console.log(`Player: ${data.id} moved to ${data.position.x}:${data.position.y}:${data.position.z}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
