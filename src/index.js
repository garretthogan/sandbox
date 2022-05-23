import { init as netInit } from './net';
import { init as uiInit } from './ui';
import { animate, initScene, initRenderer } from './lobby';
import { init as initInput } from './input';

const socket = io();

netInit(socket);
uiInit(socket);

initScene();
initRenderer();
initInput(socket);
animate();
