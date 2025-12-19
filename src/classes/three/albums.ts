import * as THREE from 'three';
import type { Track } from '../../types.ts';
import { scene } from '../../utils/scene.ts';
import { gsap } from 'gsap';

export class AlbumCover extends THREE.Object3D {
  public trackInfo: Track;
  private texture: THREE.Texture;
  private geometry: THREE.BoxGeometry;
  private materials: THREE.MeshBasicMaterial[] = [];
  private mesh: THREE.Mesh;

  constructor(
    trackInfo: Track
  ) {
    super();
    this.texture = new THREE.TextureLoader().load(trackInfo.album_cover);
    this.trackInfo = trackInfo;

    const color = new THREE.Color().setHex(parseInt(this.trackInfo.color, 16));
    
    this.materials = [
      new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false }),
      new THREE.MeshBasicMaterial({ map: this.texture, toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color), toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color), toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color), toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color), toneMapped: false }),
    ];

    this.geometry = new THREE.BoxGeometry(0.05, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.materials);
    this.mesh.userData = { trackInfo: this.trackInfo };

    gsap.to(this.mesh.rotation, {
      y: Math.PI * 2,
      duration: Math.random() * 5 + 5,
      repeat: -1,
      ease: 'linear'
    });
    gsap.to(this.mesh.position, {
      x: Math.random() * 8 - 4,
      y: Math.random() * 8 - 4,
      z: Math.random() * 8 - 4,
      duration: Math.random() * 2 + 2,
      ease: 'power1.inOut'
    });

    scene.add(this.mesh);
  }
}