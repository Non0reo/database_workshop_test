import * as THREE from 'three';
import { gsap } from 'gsap';

import { createRenderer, createPostProcessing, renderer, composer, outlinePass } from '../utils/renderer.ts';
import { camera, createCamera, orbit } from '../utils/camera.ts';
import { createScene, scene } from '../utils/scene.ts';

import { AlbumCover } from './three/albums.ts';
import { APIManager } from './api_manager.ts';
import { Raycaster } from './raycaster.ts';

export class App {
  public apiManager = new APIManager();
  public raycaster = new Raycaster();
  public selectedAlbum: AlbumCover | null = null;

  constructor() {
    createRenderer(this.draw);
    createCamera(renderer);
    createScene();
    createPostProcessing();

    //testSprites();
    this.initGuiEvents();

    this.apiManager.getTrackDatabase().then(tracks => {
      tracks.forEach(track => {
        scene.add(new AlbumCover(track));
      });
    });
  }

  private draw() {
    orbit.update();

    //renderer.render(scene, camera);
    composer.render();
  }


  private async checkForNewEntry() {
    const inputField = document.querySelector('#input-music') as HTMLInputElement;
    if (!inputField.value) {
      inputField.setCustomValidity('No song provided');
      inputField.reportValidity();
      return;
    }


    const query = inputField.value;
    inputField.value = '';

    const result = await this.apiManager.sendSearchRequest(query);
    const bestResult = await this.apiManager.getBestTrack({ data: result });

    if (bestResult) {
      this.apiManager.putInDatabase(bestResult);
      this.apiManager.musicPreview(bestResult);

      const newAlbum = new AlbumCover(bestResult);
      scene.add(newAlbum);

      this.selectedAlbum = newAlbum;
      outlinePass.selectedObjects = [this.selectedAlbum];
      newAlbum.onBecomeSelected();

    } else {
      inputField.setCustomValidity('No results found');
      inputField.reportValidity();
    }
  }


  private initGuiEvents() {
    window.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        this.checkForNewEntry();
      }
    });

    (document.querySelector('#button-submit') as HTMLInputElement).addEventListener('click', () => {
      this.checkForNewEntry();
    });

    renderer.domElement.addEventListener('mousedown', (event) => {
      const raycaster = this.raycaster.castRay(event);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        let albumCover: AlbumCover | undefined;

        firstIntersect.traverseAncestors((ancestor) => {
          if (ancestor instanceof AlbumCover)
            albumCover = ancestor;
        });

        if (albumCover) {
          if (this.selectedAlbum === albumCover) {

            this.apiManager.stopMusicPreviews();
            this.selectedAlbum.onBecomeDeselected();
            this.selectedAlbum = null;
            outlinePass.selectedObjects = [];
            return;
          }

          this.selectedAlbum = albumCover;
          outlinePass.selectedObjects = [this.selectedAlbum];
          this.apiManager.musicPreview(albumCover.trackInfo);
          this.selectedAlbum.onBecomeSelected();
          
        }
      }
    });
  }
}