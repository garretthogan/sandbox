import { getModel, getModels, initNewPlayer } from './lobby';
import { setRoomCode } from './ui';
import { SOCKET_EVENTS } from './utils';

let playersInRoom = {}
let playerName = null;
let playerId = null;
let roomKey = null;
let worldPosition = null;

export function getPlayerInfo() {
  return { worldPosition, playerName, playerId };
}

export function getRoomInfo() {
  console.log({ playersInRoom, playerName, playerId, roomKey });
  return { playersInRoom, playerName, playerId, roomKey };
}

export function init(socket) {
  socket.on(SOCKET_EVENTS.PLAYER_JOINED, (id, name, associatedRoomKey, players) => {
    if(!playerId) {
      playerId = id;
      playerName = name;
      worldPosition = players[id].position;
    }

    if(!roomKey || roomKey !== associatedRoomKey) {
      roomKey = associatedRoomKey;
    }

    console.log('player joined ', id, name, players, roomKey);
    playersInRoom = players;
    console.log({playerId});
    Object.keys(players).map(pid => initNewPlayer(players[pid].position, playerId === pid, pid));
    // initRobot(players[id].position);
    console.log({playersInRoom});

    setRoomCode(roomKey);
  });
  
  socket.on(SOCKET_EVENTS.ROOM_CREATED, (newRoomKey, newPlayerId, newPlayerName) => {
    console.log('ROOM KEY ', newRoomKey, newPlayerId, newPlayerName);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, newRoomKey);
    setRoomCode(newRoomKey);
    // playerName = newPlayerName;
    // roomKey = newRoomKey;
    // playerId = newPlayerId;
  });

  socket.on(SOCKET_EVENTS.PLAYER_NAME_UPDATED, (associatedPlayerId, newName) => {
    if(playerId === associatedPlayerId) {
      playerName = newName;
    }

    playersInRoom[associatedPlayerId].name = newName;

    console.log('player name updated', {playerName, playersInRoom});
  });

  socket.on(SOCKET_EVENTS.PLAYER_POS_UPDATED, (associatedPlayerId, position) => {
    playersInRoom[associatedPlayerId].position = position;
    getModels()[associatedPlayerId].position.set(position.x, position.y, position.z);
  });
}
