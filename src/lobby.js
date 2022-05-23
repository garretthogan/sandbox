// import { GUI } from './lil-gui.module.min.js';

import { GLTFLoader } from './GLTFLoader.js';

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, face;

let model;

const models = {};

export function getModel() {
  return model;
}

export function getModels() {
  return models;
}

const api = { state: 'Walking' };

export function getScene() {
  return scene;
}

function initRobot(pos, isLocal, pid) {
  console.log({pos});
  const loader = new GLTFLoader();
  loader.load( '/RobotExpressive.glb', function ( gltf ) {
    model = gltf.scene;

    const rightHand1 = model.getObjectByName('HandR_1');
    const rightHand2 = model.getObjectByName('HandR_2');
    const color5 = new THREE.Color( isLocal ? 'skyblue' : 'red' );

    rightHand1.material.color.set(color5);
    rightHand2.material.color.set(new THREE.Color('orange'));

    const hands = model.children[0].children.filter(child => child.name.includes('Hand'));

    console.log({model, hands, rightHand1, rightHand2});
    model.position.set(pos.x, pos.y, pos.z);

    getScene().add( model );

    models[pid] = model;

    // createGUI( model, gltf.animations );

  }, undefined, function ( e ) {

    console.error( e );

  } );
}

export function initNewPlayer(pos, isLocal, pid) {
  initRobot(pos, isLocal, pid);
}

export function initScene() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
  camera.position.set( - 5, 3, 10 );
  camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xe0e0e0 );
  scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( 0, 20, 0 );
  scene.add( hemiLight );

  const dirLight = new THREE.DirectionalLight( 0xffffff );
  dirLight.position.set( 0, 20, 10 );
  scene.add( dirLight );

  // ground

  const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  scene.add( mesh );

  const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add( grid );
}

export function initRenderer() {
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );
}

//

export function animate() {

  const dt = clock.getDelta();

  if ( mixer ) mixer.update( dt );

  requestAnimationFrame( animate );

  renderer.render( scene, camera );

}