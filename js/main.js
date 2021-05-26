//import 3d library and movement and control modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import {
	PointerLockControls
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/PointerLockControls.js';
import {
	GLTFLoader
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
//initialise variables 
let scene, renderer, loader, model, light, player;
let velocity = 1;
let gravity = 0.382;
let gravityVelocity = 0.098
var moveForward = false;
var enemies = [];
function init() {

	
	class Player {
		constructor(direction, vector, camera, controls) {
			this.direction = new THREE.Vector3();
			this.vector = new THREE.Vector3();
			this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
			this.controls = new PointerLockControls(this.camera, document.body);
		}
		update() {
			document.addEventListener('click', function() {
				// warning : in current chrome build ther pointer lock api retrurns errors on call. https://bugs.chromium.org/p/chromium/issues/detail?id=1127920
				player.controls.lock();
			}, false);

			player.controls.addEventListener('lock', function () {

			//	instructions.style.display = 'none';
			//	blocker.style.display = 'none';

			});

			player.controls.addEventListener('unlock', function () {

			//	blocker.style.display = 'block';
			//	instructions.style.display = '';
			});

			velocity = (velocity / 1.01);
			this.camera.getWorldDirection(this.direction);
			this.camera.position.addScaledVector(this.direction, velocity);
			//this.camera.position = this.gravityVector;
			this.camera.position.setY((this.camera.position.y - gravity));
			console.log(this.camera.position.z - gravity)
			if (moveForward == true) {
				velocity = velocity + 0.025
			}
			if (this.gravityVelocity > 0.98) {
			}
			renderer.render(scene, this.camera);
		}
	}

	class Enemy {
		constructor(type, posX, posY) {
			this.type = type;
			this.posX = posX;
			this.posY = posY;
		}
		updatePos() {
			this.posX = +velocity
			this.posY = +velcoty
		}
	}
	//gui = new gui();
	player = new Player();
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	// Light and models
	light = new THREE.AmbientLight(0x404040); // soft white light
	scene.add(light);
	loader = new GLTFLoader(); //initialise our model loader
        // "Ship in Clouds" (https://skfb.ly/67IY9) by Bastien Genbrugge is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
	loader.load('assets/ship_in_clouds/scene.gltf', function(gltf) { //load the level within gtlf and then add it to the main scene
		model = gltf.scene // assign a variable to store the currently rendered level
		model.scale.set(0.5, 0.5, 0.5); // resize the scene to fit the canvas
		scene.add(model);
	}, undefined, function(error) {	// error logging
		console.error(error);
	});
    //animation
	const animate = function(vector) {
		requestAnimationFrame(animate);
		player.update()
	};
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////// movement/interaction code ///////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//hook camera with control module
	// add event listener to show/hide a UI (e.g. the game's menu)
	// listen for keypresses
	document.addEventListener("keydown", function(KeyboardEvent) {
		if (KeyboardEvent.key == "w") {
			moveForward = true;
			console.log(moveForward)
		} else if (KeyboardEvent.key == "a") {
			moveLeft = true;
		} else if (KeyboardEvent.key == "d") {
			moveRight = true;
		}
	})
	document.addEventListener("keyup", function(KeyboardEvent) {
		if (KeyboardEvent.key == "w") {
			moveForward = false;
		} else if (KeyboardEvent.key == "a") {
			moveLeft = false;
		} else if (KeyboardEvent.key == "d") {
			moveRight = false;
		}
	})
	//animate 3d objects
	animate();
}
//start main loop function
init();
