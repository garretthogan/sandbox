import BufferGeometryUtils from './BufferGeometryUtils';
import { getY, worldHalfWidth, worldHalfDepth, worldDepth, worldWidth } from './utils';

export function generate() {

  const matrix = new THREE.Matrix4();

  const pxGeometry = new THREE.PlaneGeometry( 100, 100 );
  pxGeometry.attributes.uv.array[ 1 ] = 0.5;
  pxGeometry.attributes.uv.array[ 3 ] = 0.5;
  pxGeometry.rotateY( Math.PI / 2 );
  pxGeometry.translate( 50, 0, 0 );

  const nxGeometry = new THREE.PlaneGeometry( 100, 100 );
  nxGeometry.attributes.uv.array[ 1 ] = 0.5;
  nxGeometry.attributes.uv.array[ 3 ] = 0.5;
  nxGeometry.rotateY( - Math.PI / 2 );
  nxGeometry.translate( - 50, 0, 0 );

  const pyGeometry = new THREE.PlaneGeometry( 100, 100 );
  pyGeometry.attributes.uv.array[ 5 ] = 0.5;
  pyGeometry.attributes.uv.array[ 7 ] = 0.5;
  pyGeometry.rotateX( - Math.PI / 2 );
  pyGeometry.translate( 0, 50, 0 );

  const pzGeometry = new THREE.PlaneGeometry( 100, 100 );
  pzGeometry.attributes.uv.array[ 1 ] = 0.5;
  pzGeometry.attributes.uv.array[ 3 ] = 0.5;
  pzGeometry.translate( 0, 0, 50 );

  const nzGeometry = new THREE.PlaneGeometry( 100, 100 );
  nzGeometry.attributes.uv.array[ 1 ] = 0.5;
  nzGeometry.attributes.uv.array[ 3 ] = 0.5;
  nzGeometry.rotateY( Math.PI );
  nzGeometry.translate( 0, 0, - 50 );

  //

  const geometries = [];

  for ( let z = 0; z < worldDepth; z ++ ) {

    for ( let x = 0; x < worldWidth; x ++ ) {

      const h = getY( x, z );

      matrix.makeTranslation(
        x * 100 - worldHalfWidth * 100,
        h * 100,
        z * 100 - worldHalfDepth * 100
      );

      const px = getY( x + 1, z );
      const nx = getY( x - 1, z );
      const pz = getY( x, z + 1 );
      const nz = getY( x, z - 1 );

      geometries.push( pyGeometry.clone().applyMatrix4( matrix ) );

      if ( ( px !== h && px !== h + 1 ) || x === 0 ) {

        geometries.push( pxGeometry.clone().applyMatrix4( matrix ) );

      }

      if ( ( nx !== h && nx !== h + 1 ) || x === worldWidth - 1 ) {

        geometries.push( nxGeometry.clone().applyMatrix4( matrix ) );

      }

      if ( ( pz !== h && pz !== h + 1 ) || z === worldDepth - 1 ) {

        geometries.push( pzGeometry.clone().applyMatrix4( matrix ) );

      }

      if ( ( nz !== h && nz !== h + 1 ) || z === 0 ) {

        geometries.push( nzGeometry.clone().applyMatrix4( matrix ) );

      }

    }

  }

  const geometry = BufferGeometryUtils.mergeBufferGeometries( geometries );
  geometry.computeBoundingSphere();

  const texture = new THREE.TextureLoader().load( '/atlas.png' );
  texture.magFilter = THREE.NearestFilter;

  const mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, side: THREE.DoubleSide } ) );

  return mesh;
}