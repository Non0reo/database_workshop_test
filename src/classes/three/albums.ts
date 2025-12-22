import * as THREE from 'three';
import type { Track } from '../../types.ts';
import { gsap } from 'gsap';
import { camera, orbit } from '../../utils/camera.ts';

export class AlbumCover extends THREE.Object3D {
  public trackInfo: Track;
  public targetPosition: THREE.Vector3 = new THREE.Vector3();
  private texture: THREE.Texture;
  private geometry: THREE.BoxGeometry;
  private materials: THREE.MeshBasicMaterial[] = [];
  private mesh: THREE.Mesh;
  private disc: AlbumDisc;

  constructor(
    trackInfo: Track
  ) {
    super();
    this.trackInfo = trackInfo;
    this.texture = new THREE.TextureLoader().load(trackInfo.album_cover);
    this.disc = new AlbumDisc(this.texture);

    const color = new THREE.Color().setHex(parseInt(this.trackInfo.color, 16));
    this.materials = [
      new THREE.MeshBasicMaterial({ map: this.texture }),
      new THREE.MeshBasicMaterial({ map: this.texture }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color) }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color) }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color) }),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color) }),
    ];

    this.geometry = new THREE.BoxGeometry(0.05, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.materials);
    this.mesh.userData = { trackInfo: this.trackInfo };

    this.add(this.mesh);
    this.add(this.disc);

    this.targetPosition.set(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    this.targetPosition.normalize().multiplyScalar(10);

    gsap.to(this.rotation, {
      y: Math.PI * 2,
      duration: Math.random() * 8 + 8,
      repeat: -1,
      ease: 'linear'
    });
    gsap.to(this.position, {
      ...this.targetPosition,
      duration: 1,
      ease: 'power4.inOut'
    });
  }

  public onBecomeSelected() {
    this.disc.putDiscOut();
    gsap.to(orbit.target, {...this.targetPosition, duration: 1, ease: 'power3.inOut'});
    gsap.to(camera.position, {...this.targetPosition.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(- 2)), duration: 1, ease: 'power3.inOut' });
  }

  public onBecomeDeselected() {
    this.disc.putDiscIn();
    gsap.to(camera.position, {...camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(-2)), duration: 1, ease: 'power3.inOut' });
  }

  
}


class AlbumDisc extends THREE.Object3D {
  private coverTexture: THREE.Texture;
  private discGeometry: THREE.CircleGeometry;
  private discMaterial: THREE.MeshBasicMaterial;
  private discMesh: THREE.Mesh;

  private coverDotGeometry: THREE.CylinderGeometry;
  private coverDotMaterial: THREE.MeshBasicMaterial
  private coverDotMesh: THREE.Mesh;

  private animationTween?: gsap.core.Tween;

  constructor(
    coverTexture: THREE.Texture
  ) {
    super();
    this.coverTexture = coverTexture;
    this.discGeometry = new THREE.CircleGeometry(0.5, 40);
    this.discMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/vinyl.png'), side: THREE.DoubleSide });
    this.discMesh = new THREE.Mesh(this.discGeometry, this.discMaterial);

    this.coverDotGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.001, 32);
    this.coverDotMaterial = new THREE.MeshBasicMaterial({ map: this.coverTexture });
    this.coverDotMesh = new THREE.Mesh(this.coverDotGeometry, this.coverDotMaterial);
    this.coverDotMesh.rotation.x = Math.PI / 2;

    this.add(this.discMesh);
    this.add(this.coverDotMesh);

    this.rotation.set(0, Math.PI / 2, 0);
    this.position.set(0, 0, 0);

    return this;
  }

  public putDiscIn() {
    gsap.to(this.position, {
      z: 0,
      duration: 2,
      ease: 'power2.inOut'
    });

    if(this.animationTween) this.animationTween.kill();
    gsap.to(this.rotation, {
      x: 0,
      duration: 2,
      ease: 'power2.inOut'
    });
  }

  public putDiscOut() {
    gsap.to(this.position, {
      z: 0.6,
      duration: 2,
      ease: 'power2.inOut'
    });
    
    this.animationTween = gsap.to(this.rotation, {
      x: Math.PI * 4,
      duration: 20,
      ease: 'linear',
      repeat: -1,
      onComplete: () => { this.animationTween?.restart(); }
    });
  }
}
