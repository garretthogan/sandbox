import { SOCKET_EVENTS } from './utils';

let playersInRoom = {}
let playerName = null;
let playerId = null;
let roomKey = null;

export function getRoomInfo() {
  console.log({ playersInRoom, playerName, playerId, roomKey });
  return { playersInRoom, playerName, playerId, roomKey };
}

export function init(socket) {
  socket.on(SOCKET_EVENTS.PLAYER_JOINED, (id, name, associatedRoomKey, players) => {
    if(!playerId) {
      playerId = id;
      playerName = name;
    }

    if(!roomKey || roomKey !== associatedRoomKey) {
      roomKey = associatedRoomKey;
    }

    console.log('player joined ', id, name, players, roomKey);
    playersInRoom = players;
    console.log({playersInRoom});
  });
  
  socket.on(SOCKET_EVENTS.ROOM_CREATED, (newRoomKey, newPlayerId, newPlayerName) => {
    console.log('ROOM KEY ', newRoomKey, newPlayerId, newPlayerName);
    playerName = newPlayerName;
    roomKey = newRoomKey;
    playerId = newPlayerId;
  });

  socket.on(SOCKET_EVENTS.PLAYER_NAME_UPDATED, (associatedPlayerId, newName) => {
    if(playerId === associatedPlayerId) {
      playerName = newName;
    }

    playersInRoom[associatedPlayerId].name = newName;

    console.log('player name updated', {playerName, playersInRoom});
  });
}
