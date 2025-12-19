import gsap from 'gsap';

export class AudioManager {
  public maxVolume: number = 0.2;
  public fadeDuration: number = 5;
  public audioElement: HTMLAudioElement;
  private endCallback?: (value?: AudioManager) => void;

  constructor(src: string, endCallback?: (value?: AudioManager) => void) {
    this.audioElement = new Audio(src);
    this.audioElement.load();
    this.endCallback = endCallback;

    this.audioElement.addEventListener('loadedmetadata', () => this.fadeIn());
  }

  public fadeIn() {
    gsap.fromTo(this.audioElement, { volume: 0 }, { volume: this.maxVolume, duration: this.fadeDuration, ease: "power2.out" });
    this.audioElement.play();
    
    console.log((this.audioElement.duration - this.fadeDuration) * 1000)
    setTimeout(() => this.fadeOut(), (this.audioElement.duration - this.fadeDuration) * 1000);
  }

  public fadeOut() {
    console.log('Fading out audio');
    gsap.to(this.audioElement, { volume: 0, duration: this.fadeDuration, ease: "power2.out" }).then(() => {
      console.log('Audio paused');
      this.audioElement.pause();
      if(this.endCallback) this.endCallback(this);
    });
  }
}