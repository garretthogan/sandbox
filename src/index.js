import Player from './Player';
import { generate } from './World';

const socket = io();

const player = new Player('abc123');

socket.on('player joined', (id) => {
  console.log('Player joined ', id);
});

const button = document.getElementById('join-button');
const input = document.getElementById('join-input');

button.addEventListener('click', () => {
  console.log('JOIN ROOM ', input.value);
  socket.emit('join room', input.value);
});

const clock = new THREE.Clock();

const container = document.getElementById('app');
const stats = new Stats();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer( { antialias: true } );

function init() {
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

function animate() {

  requestAnimationFrame( animate );

  render();
  stats.update();

}

function render() {

  player.update( clock.getDelta() );
  renderer.render( scene, player.camera );

}

init();
animate();
