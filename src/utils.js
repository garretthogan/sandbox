import ImprovedNoise from './ImprovedNoise';

export const SOCKET_EVENTS = {
  PLAYER_JOINED: 'player joined',
  ROOM_CREATED: 'room created',
  PLAYER_NAME_UPDATED: 'player name updated',
  CREATE_ROOM: 'create room',
  UPDATE_PLAYER_NAME: 'update player name',
  JOIN_ROOM: 'join room'
}

function generateHeight( width, height ) {

  const data = [], perlin = new ImprovedNoise(),
    size = width * height, z = Math.random() * 100;

  let quality = 2;

  for ( let j = 0; j < 4; j ++ ) {

    if ( j === 0 ) for ( let i = 0; i < size; i ++ ) data[ i ] = 0;

    for ( let i = 0; i < size; i ++ ) {

      const x = i % width, y = ( i / width ) | 0;
      data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;


    }

    quality *= 4;

  }

  return data;

}

export const worldWidth = 128, worldDepth = 128;
export const worldHalfWidth = worldWidth / 2;
export const worldHalfDepth = worldDepth / 2;

export const data = generateHeight( worldWidth, worldDepth );

export function getY( x, z ) {

  return ( data[ x + z * worldWidth ] * 0.15 ) | 0;

}