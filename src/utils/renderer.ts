import * as THREE from 'three';

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
  })
}

export { createRenderer };