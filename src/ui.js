import { getRoomInfo } from './net';
import { SOCKET_EVENTS } from './utils';

export function init(socket) {
  const createButton = document.getElementById('create-button');
  const createInput = document.getElementById('create-input');
  
  createButton.addEventListener('click', () => {
    console.log('CREATE ROOM ', createInput.value);
    socket.emit(SOCKET_EVENTS.CREATE_ROOM, createInput.value);
  });
  
  const joinButton = document.getElementById('join-button');
  const joinInput = document.getElementById('join-input');
  
  joinButton.addEventListener('click', () => {
    console.log('JOIN ROOM ', joinInput.value);
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, joinInput.value);
  });
  
  const updateNameButton = document.getElementById('player-name-button');
  const updateNameInput = document.getElementById('player-name-input');
  
  updateNameButton.addEventListener('click', () => {
    const roomInfo = getRoomInfo();
    console.log('UPDATE NAME ', updateNameInput.value, roomInfo);
    socket.emit(SOCKET_EVENTS.UPDATE_PLAYER_NAME, updateNameInput.value, roomInfo.playerId, roomInfo.roomKey);
  });  
}

export function setRoomCode(roomCode) {
  const roomCodeInfo = document.getElementById('room-code');
  roomCodeInfo.innerText = `Room Code: ${roomCode}`;
}
