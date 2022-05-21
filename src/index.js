import { init as netInit } from './net';
import { init as uiInit } from './ui';
import { init as gameInit } from './game';

const socket = io();

netInit(socket);
uiInit(socket);
gameInit(socket);
