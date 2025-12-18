import * as THREE from 'three';

let scene: THREE.Scene;

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202536);

    return scene;
}

export { scene, createScene };