import * as THREE from '/js/threejs/three.module.js';
import { PointerLockControls } from '/js/threejs/utils/PointerLockControls.js'
let fpCamera, scene, renderer, geometry, material, mesh, controls;

init();

function init() {

	fpCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	fpCamera.position.z = 1;
	controls = new PointerLockControls(fpCamera, document.body)
	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	document.body.appendChild( renderer.domElement );

}

function animation( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, fpCamera );

}
