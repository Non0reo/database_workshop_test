import * as THREE from 'three';
import { OrbitControls } from 'three/addons';

let camera: THREE.PerspectiveCamera
let orbit: OrbitControls;

function createCamera(renderer: THREE.WebGLRenderer) {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.04;

    camera.position.set(0, 0, 2);

    return { camera, orbit };
}

export { camera, orbit, createCamera };