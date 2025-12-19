import { createRenderer, renderer } from '../utils/renderer.ts';
import { createCamera, camera, orbit } from '../utils/camera.ts';
import { createScene, scene } from '../utils/scene.ts';

import { testSprites } from '../utils/debug.ts';
import { FlatImage, FlatSprite } from './three/sprites.ts';

import { APIManager } from './api_manager.ts';

export class App {
  public apiManager = new APIManager();

  constructor() {
    createRenderer(this.draw);
    createCamera(renderer);
    createScene();

    testSprites();
    this.initGuiEvents();

    /* setTimeout(async () => {
      console.log(await this.apiManager.sendSearchRequest('Watch Me Keiona'))
    }, 1000) */
  }

  private draw() {
    orbit.update();

    renderer.render(scene, camera);
  }


  private initGuiEvents() {
    window.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        const inputField = document.querySelector('#input-music') as HTMLInputElement;
        if (inputField.value) {

          const result = await this.apiManager.sendSearchRequest(inputField.value);
          console.log(result);

          if (result) {
            this.apiManager.musicPreview(result['data'][0]);

            scene.add(new FlatSprite(result['data'][0].album.cover_xl, 1));
          }

          inputField.value = '';


        }
      }

      if (event.key === 'Space') {
        this.apiManager.sendYTMusicSearchRequest('Imagine Dragons Believer').then(result => {
          console.log(result);
        });
      }
    });
  }
}