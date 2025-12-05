import * as THREE from 'three';




class FlatSprite extends THREE.Object3D {
    private texture: THREE.Texture;
    private material: THREE.SpriteMaterial
    private geometry: THREE.Sprite;

    constructor(imagePath: string, size: number) {
        super();

        this.texture = new THREE.TextureLoader().load(imagePath);
        this.material = new THREE.SpriteMaterial({ map: this.texture, transparent: true });
        this.geometry = new THREE.Sprite(this.material);
        this.geometry.scale.set(size, size, 1);

        this.add(this.geometry);
    }
}


class FlatImage extends THREE.Object3D {
    private texture: THREE.Texture;
    private material: THREE.MeshBasicMaterial;
    private geometry: THREE.PlaneGeometry;

    constructor(imagePath: string, size: number) {
        super();

        this.texture = new THREE.TextureLoader().load(imagePath);
        this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide });
        this.geometry = new THREE.PlaneGeometry(size, size);
        const mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(mesh);
    }
}


export { FlatSprite, FlatImage };