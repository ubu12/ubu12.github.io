//import 3d library and movement and control modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
//initialise variables 
let fpCamera, scene, renderer, loader, model, light, angle;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// scene/rendering code ////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function init () {
     //give values to our variables and initliase our renderers

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
        const direction = new THREE.Vector3;
        const animate = function (vector) {
        var velocity = 1;
            var axis = new THREE.Vector3( 0, 2, 0 );
            var angle = Math.PI / 2;
            var vector = new THREE.Vector3();
            fpCamera.getWorldDirection(direction);
            angle = THREE.Math.radToDeg( Math.atan2(vector.x,vector.z) );  
            requestAnimationFrame( animate );
            renderer.render( scene, fpCamera );
            if (moveForward == true) {     
             fpCamera.position.addScaledVector(direction, velocity);
             console.log(direction)

           }
             if (moveRight == true) {     
             fpCamera.position.addScaledVector(direction.applyAxisAngle(axis, angle) , velocity);
              

           }
                          if (moveLeft == true) {     
             fpCamera.position.addScaledVector(direction.z-0.90, velocity);
           }
             if (moveBackward == true) {     
             fpCamera.position.addScaledVector(direction, -velocity);
           }

        };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// movement/interaction code ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //hook camera with control module
    const controls = new PointerLockControls( fpCamera, document.body );
    // add event listener to show/hide a UI (e.g. the game's menu)
    document.addEventListener( 'click', function () {
    // warning : in currect chrome build ther pointer lock api retrurns errors on call. https://bugs.chromium.org/p/chromium/issues/detail?id=1127920
        controls.lock();
    
    }, false);
     
    // listen for keypresses
    document.addEventListener("keydown", function (KeyboardEvent){
        if (KeyboardEvent.key == "w") {
            moveForward = true;
             console.log(moveForward)
        }
        else if (KeyboardEvent.key == "a") {
            moveLeft = true;
        }
        else if (KeyboardEvent.key == "s") {
            moveBackward = true;
        }
        else if (KeyboardEvent.key == "d") {
            moveRight = true;
        }
    })
    document.addEventListener("keyup", function (KeyboardEvent){
        if (KeyboardEvent.key == "w") {
            moveForward = false;
        }
        else if (KeyboardEvent.key == "a") {
            moveLeft = false;
        }
        else if (KeyboardEvent.key == "s") {    
            moveBackward = false;
        }
        else if (KeyboardEvent.key == "d") {
            moveRight = false;
        }
    })
    //animate 3d objects
    animate();
    // find camera angle relative to 0
 
    

    

}
//start main loop function
init();
