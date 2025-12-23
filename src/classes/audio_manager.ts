import gsap from 'gsap';
import { generalVolume } from './App';

export class AudioManager {
  public maxVolume: number = generalVolume;
  public fadeDuration: number = 2;
  public audioElement: HTMLAudioElement;
  public canChangeAudioVolume: boolean = true;
  private endCallback?: (value?: AudioManager) => void;

  constructor(src: string, endCallback?: (value?: AudioManager) => void) {
    this.audioElement = new Audio(src);
    this.audioElement.load();
    this.endCallback = endCallback;

    this.audioElement.addEventListener('loadedmetadata', () => this.fadeIn());
  }

  public updateVolume(value: number) {
    if (this.canChangeAudioVolume) {
      this.maxVolume = value;
      this.audioElement.volume = value;
    }
  }

  public fadeIn() {
    gsap.fromTo(this.audioElement, { volume: 0 }, { volume: this.maxVolume, duration: this.fadeDuration, ease: "power3.out" })
      .then(() => {
        this.canChangeAudioVolume = true;
      });
    this.audioElement.play();
    setTimeout(() => this.fadeOut(), (this.audioElement.duration - this.fadeDuration) * 1000);
  }

  public fadeOut() {
    this.canChangeAudioVolume = false;
    gsap.to(this.audioElement, { volume: 0, duration: this.fadeDuration, ease: "power3.out" })
      .then(() => {
        this.audioElement.pause();
        if(this.endCallback) this.endCallback(this);
      });
  }
}