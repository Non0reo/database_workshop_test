import type { Track } from "../types";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

export class GUI {
  public top: TopGUI;
  public bottom: BottomGUI;

  constructor()  {
    this.top = new TopGUI();
    this.bottom = new BottomGUI();
  }
}


class TopGUI {
  public container: HTMLDivElement;
  public mainElement: HTMLSpanElement;
  public subElement: HTMLSpanElement;
  private splitTitle?: SplitText;
  private splitArtist?: SplitText;

  constructor() {
    this.container = document.querySelector('#info-container') as HTMLDivElement;
    this.mainElement = this.container.querySelector('.song.title') as HTMLSpanElement;
    this.subElement = this.container.querySelector('.song.artist.year') as HTMLSpanElement;

    
  }

  public setTrack(track: Track) {
    this.splitArtist?.revert();
    this.splitTitle?.revert();

    this.mainElement.textContent = track.title;
    this.subElement.textContent = `${track.artist_name} • ${track.release_date.split('-')[0]}`;
    
    this.splitTitle = new SplitText(this.mainElement, { type: "chars" });
    this.splitArtist = new SplitText(this.subElement, { type: "chars" });

    const defaultParams = {
      duration: 0.6,
      opacity: 0,
      y: 20,
      ease: "back.out(1.7)",
      stagger: 0.05,
    } as gsap.TweenVars;

    gsap.from(this.splitTitle.chars, { ...defaultParams });
    gsap.from(this.splitArtist.chars, { ...defaultParams, delay: 0.5 });
  }

  public open() {
    this.container.classList.add('visible');
  }

  public close() {
    this.container.classList.remove('visible');
  }
}





class BottomGUI {
  public container: HTMLDivElement
  public trashButton: HTMLButtonElement;
  public volumeInput: HTMLInputElement
  public musicInput: HTMLInputElement;
  public submitButton: HTMLButtonElement;

  constructor() {
    this.container = document.querySelector('#ui-container') as HTMLDivElement;
    this.trashButton = this.container.querySelector('.button.trash') as HTMLButtonElement;
    this.volumeInput = this.container.querySelector('#input-volume') as HTMLInputElement;
    this.musicInput = this.container.querySelector('#input-music') as HTMLInputElement;
    this.submitButton = this.container.querySelector('.button.submit') as HTMLButtonElement;
  }

}