import * as THREE from 'three';
import { camera } from './camera';

export let renderer: THREE.WebGLRenderer;

function createRenderer(loopFunction: XRFrameRequestCallback) {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector('#scene-canvas')! });
  /* document.querySelector('#app')!.appendChild( renderer.domElement ); */
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(loopFunction);
  addEvents();

  return renderer;
}

function addEvents() {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
}

export { createRenderer };