import { generate } from './World';

import Player from './Player';
import { SOCKET_EVENTS } from './utils';

const player = new Player('abc123');

const clock = new THREE.Clock();

const container = document.getElementById('app');
const stats = new Stats();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer( { antialias: true } );

let hasStarted = false;

export function init(socket) {
  socket.on(SOCKET_EVENTS.ROOM_CREATED, () => {
    console.log('START GAME - rc');
    start();
    animate();
    hasStarted = true;
  });

  socket.on(SOCKET_EVENTS.PLAYER_JOINED, () => {
    if(!hasStarted) {
      console.log('START GAME - pj');
      start();
      animate();
      hasStarted = true;
    }
  });
}

function start() {
  scene.background = new THREE.Color( 0xbfd1e5 );

  player.init(renderer);

  const world = generate();
  scene.add( world );

  const ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
  directionalLight.position.set( 1, 1, 0.5 ).normalize();
  scene.add( directionalLight );

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );


  container.appendChild( stats.dom );

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  player.controls.handleResize();

}

function render() {

  player.update( clock.getDelta() );
  renderer.render( scene, player.camera );

}

export function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}
