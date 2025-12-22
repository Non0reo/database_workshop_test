import * as THREE from 'three';
import { camera } from '../utils/camera';

export class Raycaster {
  public raycaster: THREE.Raycaster;

  constructor() {
    this.raycaster = new THREE.Raycaster();
  }

  public castRay(mouse: MouseEvent, cameraIn: THREE.Camera = camera) {
    const mouseVector = new THREE.Vector2();
    mouseVector.x = (mouse.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = -(mouse.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(mouseVector, cameraIn);

    return this.raycaster;
  }

}