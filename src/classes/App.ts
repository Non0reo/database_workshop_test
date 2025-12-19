import { createRenderer, renderer } from '../utils/renderer.ts';
import { createCamera, camera, orbit } from '../utils/camera.ts';
import { createScene, scene } from '../utils/scene.ts';

import { testSprites } from '../utils/debug.ts';
import { FlatImage, FlatSprite } from './three/sprites.ts';
import { AlbumCover } from './three/albums.ts';

import { APIManager } from './api_manager.ts';

export class App {
  public apiManager = new APIManager();

  constructor() {
    createRenderer(this.draw);
    createCamera(renderer);
    createScene();

    testSprites();
    this.initGuiEvents();

    this.apiManager.getTrackDatabase().then(tracks => {
      tracks.forEach(track => {
        scene.add(new AlbumCover(track));
      });
    });
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
          const bestResult = await this.apiManager.getBestTrack({ data: result });

          if (bestResult) {

            this.apiManager.putInDatabase(bestResult);
            this.apiManager.musicPreview(bestResult);
            /* scene.add(new FlatSprite(bestResult.album_cover, 1)); */
            scene.add(new AlbumCover(bestResult));

          } else {
            inputField.setCustomValidity('No results found');
            inputField.reportValidity();
          }

          inputField.value = '';


        }
      }

      /* if (event.key === 'Space') {
        this.apiManager.sendYTMusicSearchRequest('Imagine Dragons Believer').then(result => {
          console.log(result);
        });
      } */
    });
  }
}