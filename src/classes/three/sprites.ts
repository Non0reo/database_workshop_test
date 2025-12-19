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

        this.position.set(
            Math.random() * 4 - 2,
            Math.random() * 4 - 2,
            Math.random() * 4 - 2
        )
        this.add(this.geometry);
    }
}


class FlatImage extends THREE.Object3D {
    private texture: THREE.Texture;
    private material: THREE.MeshBasicMaterial | THREE.ShaderMaterial;
    private geometry: THREE.PlaneGeometry;

    constructor(imagePath: string, size: number) {
        super();

        this.texture = new THREE.TextureLoader().load(imagePath);
        /* this.material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide }); */

        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTexture: { value: this.texture },
                uTime: { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(uTexture, vUv);
                    if (color.a < 0.1) discard;
                    gl_FragColor = color;
                }
            `,
            transparent: true
        });

        this.geometry = new THREE.PlaneGeometry(size, size, 20, 20);
        const mesh = new THREE.Mesh(this.geometry, this.material);
        this.add(mesh);
    }

    update(time: number) {
        (this.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    }
    
}


export { FlatSprite, FlatImage };