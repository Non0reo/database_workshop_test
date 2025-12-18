import { initGuiEvents } from '../utils/gui.ts';

import { createRenderer, renderer } from '../utils/renderer';
import { createCamera, camera, orbit } from '../utils/camera';
import { createScene, scene } from '../utils/scene.ts';

import { testSprites } from '../utils/debug.ts';

export class App {
  constructor() {
    createRenderer(this.draw);
    createCamera(renderer);
    createScene();

    testSprites();
    initGuiEvents();
  }

  private draw() {
    orbit.update();

    renderer.render(scene, camera);
  }
}