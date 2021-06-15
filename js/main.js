
//import 3d library and movement and control modules
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

import {
    PointerLockControls
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/PointerLockControls.js';

import {
    GLTFLoader
} from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

//initialise variables 
let scene, renderer, model, light, target, levelLoaded, levelOn, paused;
let callCount;
let playerlist = [];
let meshList = [];
let velocity = 1;
let gravity = 0.362;
let moveForward = false;

//initialise our model loader so it can be used globally
let loader = new GLTFLoader(); 

// collsion detection function
function detectCollisionCubes(object1, object2) {

    //calculate new hitboxes (bounding boxes) for object1 and 2
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();


    // update player positions
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();

    // create a clone of the bounding box of box1 to check for intersection with box 2
    var box1 = object1.geometry.boundingBox.clone();

    // move the clone to the position of object 1
    box1.applyMatrix4(object1.matrixWorld);

    // create a clone of the bounding box of box2 to check for intersection with box 1
    var box2 = object2.geometry.boundingBox.clone();

    // move the clone to the position of object 2
    box2.applyMatrix4(object2.matrixWorld);

    // collision detected code
    if (box1.intersectsBox(box2) ) {
        // limit how many times this can be called to prevent memleaks
       

            console.log("Box1 hit Box2")
        
            //setup a new level
            setupLevel((levelOn + 1));

            // add one to the amount of times this can be called to prevent double drawing
    }
}

//function to check all the objects in a scene for meshes
function checkMeshes() {

    // traverse the scene to find obj
    scene.traverse(function(object) {

        // add any meshes to meshlist
        if (object.isMesh) {
            meshList.push(object)
        }
    });
}

// function for setting up new levels
function setupLevel(levelNumber) {
    let modelScale = [];
    // wipe the scene of the current level
    scene.remove(scene.getObjectByName("level"))

    // decide which level to load and set levelOn to represent that level
    switch (levelNumber) {
        case 1:
            levelLoaded = "assets/ship_in_clouds/scene.gltf"
            levelOn = 1;
            modelScale.length = 0
            modelScale.push(0.5, 0.5, 0.5)
            break;
        case 2:
            levelOn = 2;
            levelLoaded = "assets/the_lighthouse/scene.gltf"
            modelScale.length = 0
            modelScale.push(1, 1, 1)
            console.log(1)
            for (var i = 0; i < playerlist.length; i++) {
                
                playerlist[i].camera.position.set(0, 0, 0)
            }
            break;
        case 3:
            levelOn = 3;
            levelLoaded = "assets/stylised_sky_player_home_dioroma/scene.gltf"
            modelScale = (0.25, 0.25, 0.25)
            for (var i = 0; i < playerlist.length; i++) {
                
                playerlist[i].camera.position.set(0, 0, 0)
            }
            break;
        case 4:
            levelLoaded = "assets/stylised_sky_player_home_diorama/scene.gtlf"
            levelOn = 4;
            break;
        case 5:
            levelLoaded = "assets/sea_keep_lonely_watcher/scene.gtlf"
            levelOn = 5;
            break;

    }
    console.log(modelScale)
    // loop through all players
    for (var i = 0; i < playerlist.length; i++) {
        
        // reset player position to 0
        playerlist[i].playerModel.position.setY(100)
    }


    
    /*

    Ownership attributes

    "The Lighthouse" (https://skfb.ly/6rU7V) by cotman sam is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    Medieval Fantasy Book" (https://skfb.ly/69Qty) by Pixel is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    Sea Keep "Lonely Watcher"" (https://skfb.ly/6zvyr) by Artjoms Horosilovs is licensed under CC Attribution-NonCommercial-ShareAlike (http://creativecommons.org/licenses/by-nc-sa/4.0/).
    stylised sky player home dioroma" (https://skfb.ly/P6nF) by Sander Vander Meiren is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
     "Ship in Clouds" (https://skfb.ly/67IY9) by Bastien Genbrugge is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    */
    
    // load the level within gtlf and then add it to the main scene
    loader.load(levelLoaded, function(gltf) { 

       // assign a variable to store the currently rendered level
        model = gltf.scene  

        //name the cuurently rendered level for ease of access
        model.name = "level";

        // resize the scene to fit the canvas
        model.scale.set(modelScale[0], modelScale[1], modelScale[2]); 

        //add the model to the scene so it can be drawn
        scene.add(model);
        
    }
    // error logging for gtlf loader
    , undefined, function(error) { 
        console.error(error);
    });

    // check if any new meshes have been added to the scene, and add them to meshlist (needed for complex collisions)
    checkMeshes();


}


// function run once, on startup
function init() {

    // Goal class to create a new target for the player to go to
    class Goal {
        constructor() {

            // create a new boxgeometry for the goal
            this.geometry = new THREE.BoxGeometry(1, 1, 1);

            // create a stock material for the goal mesh 
            this.material = new THREE.MeshBasicMaterial({color: 0xffff00});

            //create the goal mesh out of the geometry and material
            this.mesh = new THREE.Mesh(this.geometry, this.material)
            
            // set the players mesh to 10 times the original size for better-feeling hitboxes
            this.mesh.scale.set(10, 10, 10)

            // move the mesh away from the starting position (temporary)
            this.mesh.position.set(-25, -25, -25)
    
        }

        //called to setup a new goal
        setup() {

            //add a new goal to the mesh
            scene.add(this.mesh)
        }
    
    }
    
    // player class to create new player objects out of ( for multiplayer support )
    class Player {
        constructor(direction, vector, camera, controls) {

            // vector for storing the direction which the player is looking
            this.direction = new THREE.Vector3();

            // define our camera object
            this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

            // create a new boxgeometry for the playermodel
            this.geometry = new THREE.BoxGeometry(1, 1, 1);

            // create a stock material for the playermodel mesh 
            this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

            //create the playerModel mesh out of the geometry and material
            this.playerModel = new THREE.Mesh(this.geometry, this.material)

            // set the players mesh to 10 times the original size for better-feeling hitboxes
            this.playerModel.scale.set(10, 10, 10)

            // create new PointerLockControls (first person controls) and link them to the camera 
            this.controls = new PointerLockControls(this.camera, document.body);

        }

        setup() {

            // link the camera and the playermodel 
            this.camera.add(this.playerModel)

            // add the camera to scene
            scene.add(this.camera)
        }

        // update the player, and some other important stuff pertaining to gameplay
        update() {

            // pause listener function 1
            this.controls.addEventListener('lock', function() {
                paused = false;
            });

            // pause listener function 2
            this.controls.addEventListener('unlock', function() {
                paused = true;
            });

            // set the playermodel position to the camera position 
            this.playerModel.position.set(this.camera.position.getComponent(0), this.camera.position.getComponent(1), this.camera.position.getComponent(2))

            // execution only occurs if pause is false (the players mouse is captured )
            if (paused == false) {

                // divide velocity by 1.01, to provide a air resistance effect, and enable "gliding"  
                velocity = (velocity / 1.01);

                // get the players view angle to be moved towards
                this.camera.getWorldDirection(this.direction);

                //  this code moves the player towards whatever it is looking at if velocity is greater than 0
                this.camera.position.addScaledVector(this.direction, velocity);

                // set the camera position to itself - a gravity constant (this method doesnt support gravity acceleration, but it allows for a non-vector based gravity system)
                this.camera.position.setY((this.camera.position.y - gravity));

                // code for forward movement 
                if (moveForward == true) {
                    velocity = velocity + 0.025
                };

            }

            // render the current scene from the perspective of the camera (on pause allows for saving rescources)
            renderer.render(scene, this.camera);

        }
    }

// this class is temporarily redundant, and may be used later if i implement enemies. 
/*
    class Enemy {
        // constructors for enemy type and class
        constructor(type, posX, posY) {
            this.type = type;
            this.posX = posX;
            this.posY = posY;
        }

        //update enemy position
        updatePos() {
            this.posX = +velocity
            this.posY = +velcoty
        }
    }
    */

    // add event listener for the player clicking
    document.addEventListener('click', function() {

        // warning : in current chrome build ther pointer lock api retrurns errors on call. https://bugs.chromium.org/p/chromium/issues/detail?id=1127920
        for (var i = 0; playerlist.length; i++) {

            //capture the players controls (this will be changed to a local variable if in multiplayer, this is slightly spaghetti)
            playerlist[i].controls.lock();
        }


    }, false);

    // create a new THREE.JS scene to be rendered
    scene = new THREE.Scene();

    // add light to the scene
    light = new THREE.AmbientLight(); // soft white light
    scene.add(light);

    // create a new target for the player to go to
    target = new Goal();
    target.setup();

    // create a new player object and push it to the playerlist
    playerlist.push(new Player());

    //setup the new player 
    for (var i = 0; i < playerlist.length; i++) {
        playerlist[i].setup
    }

    //create a new renderer and set its properties
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // setup the current level (initially 1)
    setupLevel(1)

    //animation function (effectivley main loop)
    const animate = function() {

        //start drawing menu

        //find menu div, and set the inner text content to the pause state
        document.getElementById("menu").textContent = paused;
        //find speed div, and set inner text content to the velocity of the player
        document.getElementById("speed").textContent = " " + velocity;
        
        //loop through the playerlist 
        for (var i = 0; i < playerlist.length; i++) {

            //update all players positions on playerlist (support for multiplayer )
            playerlist[i].update()

            //detect collision between player and goal mesh
            detectCollisionCubes(playerlist[i].playerModel, target.mesh)

        }

        //loop animation function
        requestAnimationFrame(animate);


    };

    //movement listeners 

    document.addEventListener("keydown", function(KeyboardEvent) {
        if (KeyboardEvent.key == "w") {
            moveForward = true;
        }
    })

    document.addEventListener("keyup", function(KeyboardEvent) {
        if (KeyboardEvent.key == "w") {
            moveForward = false;
        }
    })

    //call the animation loop
    animate();
}
//start main loop function
init();