import { getRoomInfo } from './net';

const MOVEMENT_KEYCODES = ['ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'];
let socket;
export function init(initSocket) {
  socket = initSocket;

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('keyup', handleKeyup);
}

function handleKeydown($event) {
  const keycode = $event.code;
  if(MOVEMENT_KEYCODES.includes(keycode)) {
    
  }
}

function handleKeyup($event) {
  const keycode = $event.code;
  if(MOVEMENT_KEYCODES.includes(keycode)) {
    moveForward();
  }
}

function moveForward() {
  const roomInfo = getRoomInfo();
  if(roomInfo.playerId && roomInfo.roomKey) {
    socket.emit('move forward', roomInfo.playerId, roomInfo.roomKey);
  }
}
