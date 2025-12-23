import { createRenderer, createPostProcessing, renderer, composer, outlinePass } from '../utils/renderer.ts';
import { createCamera, orbit } from '../utils/camera.ts';
import { createScene, scene } from '../utils/scene.ts';

import { AlbumCover } from './three/albums.ts';
import { APIManager } from './api_manager.ts';
import { Raycaster } from './raycaster.ts';
import { GUI } from './gui.ts';

export let generalVolume: number;

export class App {
  public apiManager = new APIManager();
  public raycaster = new Raycaster();
  public selectedAlbum: AlbumCover | null = null;
  public gui: GUI = new GUI();

  constructor() {
    createRenderer(this.draw);
    createCamera(renderer);
    createScene();
    createPostProcessing();

    this.setGeneralVolume(0.5);
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


  private selectAlbum(album: AlbumCover) {
    this.deselectCurrentAlbum();
    this.selectedAlbum = album;
    outlinePass.selectedObjects = [this.selectedAlbum];
    this.selectedAlbum.onBecomeSelected();
    this.apiManager.musicPreview(this.selectedAlbum.trackInfo);
    this.gui.bottom.trashButton.disabled = false;
    this.gui.top.setTrack(this.selectedAlbum.trackInfo);
    this.gui.top.open();
  }

  private deselectCurrentAlbum() {
    if (this.selectedAlbum) {
      this.apiManager.stopMusicPreviews();
      this.selectedAlbum.onBecomeDeselected();
      this.selectedAlbum = null;
      outlinePass.selectedObjects = [];
      this.gui.bottom.trashButton.disabled = true;
      this.gui.top.close();
    }
  }

  private async checkForNewEntry() {
    const inputField = this.gui.bottom.musicInput;
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
      const newAlbum = new AlbumCover(bestResult);
      scene.add(newAlbum);

      this.selectAlbum(newAlbum);

    } else {
      inputField.setCustomValidity('No results found');
      inputField.reportValidity();
    }
  }

  private async deleteSelectedEntry() {
    if (this.selectedAlbum) {
      await this.apiManager.removeFromDatabase(this.selectedAlbum.trackInfo);
      scene.remove(this.selectedAlbum);
      this.deselectCurrentAlbum();
    }
  }

  private setGeneralVolume(value: number) {
    const target = this.gui.bottom.volumeInput;
    generalVolume = Math.max(-Math.log10(1.1 - value), 0);
    this.apiManager.setPreviewVolume(generalVolume);
    target.style.setProperty('--volume-level', value * 100 + '%');
  }



  private initGuiEvents() {
    window.addEventListener('keydown', async (event) => {
      if (event.key === 'Enter') {
        this.checkForNewEntry();
      }
    });

    this.gui.bottom.submitButton.addEventListener('click', () => {
      this.checkForNewEntry();
    });

    this.gui.bottom.trashButton.addEventListener('click', () => {
      this.gui.bottom.trashButton.disabled = true;
      this.deleteSelectedEntry();
    });

    this.gui.bottom.volumeInput.addEventListener('input', (event) => {
      const volume = parseFloat((event.target as HTMLInputElement).value);
      this.setGeneralVolume(volume);
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
          if (this.selectedAlbum === albumCover)
            return this.deselectCurrentAlbum();

          this.selectAlbum(albumCover);          
        }
      }
    });
  }
}