import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

let scene, camera, renderer, composer;
let maze = [];
const mazeSize = 20;
const cellSize = 5;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create error texture
  const errorTexture = createErrorTexture();

  // Generate and add maze
  generateMaze();
  createMazeGeometry(errorTexture);

  // Add glitch effect
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const glitchPass = new GlitchPass();
  composer.addPass(glitchPass);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(0xff00ff, 1, 100);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  animate();
}

function createErrorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = 'magenta';
  ctx.font = '32px Arial';
  ctx.fillText('ERROR', 70, 128);
  return new THREE.CanvasTexture(canvas);
}

function generateMaze() {
  for (let i = 0; i < mazeSize; i++) {
    maze[i] = [];
    for (let j = 0; j < mazeSize; j++) {
      maze[i][j] = Math.random() > 0.7;
    }
  }
}

function createMazeGeometry(texture) {
  const wallGeometry = new THREE.BoxGeometry(cellSize, cellSize * 2, cellSize);
  const wallMaterial = new THREE.MeshPhongMaterial({ map: texture });

  for (let i = 0; i < mazeSize; i++) {
    for (let j = 0; j < mazeSize; j++) {
      if (maze[i][j]) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(
          (i - mazeSize / 2) * cellSize,
          cellSize,
          (j - mazeSize / 2) * cellSize
        );
        scene.add(wall);
      }
    }
  }

  // Add floor
  const floorGeometry = new THREE.PlaneGeometry(mazeSize * cellSize, mazeSize * cellSize);
  const floorMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);
}

function animate() {
  requestAnimationFrame(animate);

  // Move camera in a circular pattern
  const time = Date.now() * 0.001;
  camera.position.x = Math.sin(time) * 10;
  camera.position.z = Math.cos(time) * 10;
  camera.lookAt(0, 0, 0);

  // Render the scene with post-processing
  composer.render();

  // Check if camera is out of bounds and wrap around
  if (camera.position.x < -mazeSize * cellSize / 2) camera.position.x += mazeSize * cellSize;
  if (camera.position.x > mazeSize * cellSize / 2) camera.position.x -= mazeSize * cellSize;
  if (camera.position.z < -mazeSize * cellSize / 2) camera.position.z += mazeSize * cellSize;
  if (camera.position.z > mazeSize * cellSize / 2) camera.position.z -= mazeSize * cellSize;
}

window.onload = init;