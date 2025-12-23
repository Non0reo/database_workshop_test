import * as THREE from 'three';

let scene: THREE.Scene;

function createScene() {
    scene = new THREE.Scene();

    '#191d2aff'
    scene.background = new THREE.Color(0x191d2a);

    return scene;
}

export { scene, createScene };