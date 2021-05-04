//import 3d library and movement and control modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
//initialise variables 
let fpCamera, scene, renderer, loader, model, light, accel;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let velocity = 1;
//main loop function
function init () {
 


     //give values to our variables
     //create a scene
     scene = new THREE.Scene();
     //create a new renderer
     renderer = new THREE.WebGLRenderer();
     renderer.setSize( window.innerWidth, window.innerHeight );
     document.body.appendChild( renderer.domElement );
     //create the first person camera
     fpCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
     //initialise and add a new light source to the scene
     light = new THREE.AmbientLight( 0x404040 ); // soft white light
     scene.add( light);
     //initialise our model loader
    loader = new GLTFLoader();
        // "Ship in Clouds" (https://skfb.ly/67IY9) by Bastien Genbrugge is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
        //loud the level within gtlf and then add it to the main scene
    loader.load( 'assets/ship_in_clouds/scene.gltf', function ( gltf ) {
        //assign a variable to store the currently rendered level
        model = gltf.scene
        //resize the scene to fit the canvas
        model.scale.set(0.5,0.5,0.5);
        scene.add( model );
        //error logging
    }, undefined, function ( error ) {

         console.error( error );

        } );
    //define our animation function
    const animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, fpCamera );
    };
    //hook camera with control module
    const controls = new PointerLockControls( fpCamera, document.body );
    // add event listener to show/hide a UI (e.g. the game's menu)
    document.addEventListener( 'click', function () {
        //warning : in currect chrome build ther pointer lock api retrurns errors on call. https://bugs.chromium.org/p/chromium/issues/detail?id=1127920
        controls.lock();
    
    }, false);
    //animate 3d objects
    animate();
    // find camera angle relative to 0
    var vector = camera.getWorldDirection();
    angle = THREE.Math.radToDeg( Math.atan2(vector.x,vector.z) );  
    this.position.x += velocity * Math.sin(angle);
    this.position.z -= velocity * Math.cos(angle);

    

}
//start main loop function
init();
