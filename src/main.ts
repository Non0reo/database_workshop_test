import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons';

import { FlatImage, FlatSprite } from './sprites';

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera
let orbit: OrbitControls;

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.querySelector('#app')!.appendChild( renderer.domElement );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.04;

  //renderer.domElement = document.querySelector('#app')!;
  

  scene.background = new THREE.Color(0x5a8baa);

  camera.position.set(0, 0, 2);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 1.0);
  light.position.set(2, 1, 1);
  scene.add(light);

  const image1 = new FlatSprite('textures/image1.jpg', 1);
  image1.position.set(-1.5, 0, 0);
  scene.add(image1);

  const image2 = new FlatSprite('textures/image2.png', 1);
  image2.position.set(1.5, 0, 0);
  scene.add(image2);

  renderer.setAnimationLoop(draw);
}


function draw() {
  orbit.update();

  renderer.render(scene, camera);
}


init();