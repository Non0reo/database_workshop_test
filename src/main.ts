import './style.css'
import * as THREE from 'three';
import './gui.ts';
import { OrbitControls } from 'three/addons';
import { FlatImage, FlatSprite } from './sprites';
import { initGuiEvents } from './gui';

import { createRenderer, renderer } from './utils/renderer';
import { camera } from './utils/camera';

let scene: THREE.Scene;


function init() {
  createRenderer(draw);
  
  scene = new THREE.Scene();

  
  //renderer.domElement = document.querySelector('#app')!;
  

  scene.background = new THREE.Color(0x202536);

  testSprites();
  initGuiEvents();
}

function testSprites() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(2, 1, 1);
  scene.add(light);

  const image1 = new FlatImage('textures/image1.jpg', 1);
  image1.position.set(-1.5, 0, 0);
  scene.add(image1);

  const image2 = new FlatImage('textures/image2.png', 1);
  image2.position.set(1.5, 0, 0);
  scene.add(image2);
}


function draw() {
  orbit.update();

  renderer.render(scene, camera);
}


init();