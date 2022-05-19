import FirstPersonControls from './FirstPersonControls';
import { getY, worldHalfWidth, worldHalfDepth } from './utils';

const socket = io();

export default class Player {
  constructor(id) {
    this.id = id;
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }
  onKeyDown() {
    console.log('KEY DOWN');
  }
  onKeyUp() {

  }

  init(renderer) {
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    this.camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;
    this.previousPosition = this.camera.position;

    this.controls = new FirstPersonControls(this.camera, renderer.domElement);

    this.controls.movementSpeed = 1000;
    this.controls.lookSpeed = 0.125;
    this.controls.lookVertical = true;
    this.controls.activeLook = false;

  setInterval(() => {
    if(this.isMoving())
      socket.emit('update pos', { id: this.id, position: this.getClampedPos() });
  }, 100);
  }

  update(dt) {
    this.controls.update(dt);

  }

  isMoving() {
    const controls = this.controls;

    return controls.moveForward || 
      controls.moveBackward || 
      controls.moveLeft || 
      controls.moveRight || 
      controls.moveUp || 
      controls.moveDown;
  }

  getClampedPos() {
    const position = this.controls.object.position;
    const x = Math.round(position.x);
    const y = Math.round(position.y);
    const z = Math.round(position.z);

    return { x, y, z };
  }
}