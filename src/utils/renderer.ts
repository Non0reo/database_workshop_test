import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { camera } from './camera';
import { scene } from './scene';

let renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let renderPass: RenderPass;
let outlinePass: OutlinePass;
let outputPass: OutputPass;


function createRenderer(loopFunction: XRFrameRequestCallback) {
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.querySelector('#scene-canvas')! });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(loopFunction);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  addEvents();

  return renderer;
}


function createPostProcessing() {
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(outlinePass);
  composer.addPass(outputPass);
}


function addEvents() {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    if (composer) 
      composer.setSize(window.innerWidth, window.innerHeight);
  })
}

export {
  renderer,
  composer,
  renderPass,
  outlinePass,
  outputPass,
  createRenderer,
  createPostProcessing
};