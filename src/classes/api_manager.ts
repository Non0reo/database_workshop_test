import gsap from 'gsap';
import YTMusic from 'ytmusic-api';

const maxVolume: number = 0.2;

export class APIManager {
  public lastSearchCall?: Object;
  public audioElement?: HTMLAudioElement;
  private ytmusic = new YTMusic();

  constructor() {
    this.ytmusic.initialize();
  }

  public async sendYTMusicSearchRequest(q: string) {
    /* const result = await this.ytmusic.search(q);
    console.log(result); */
    const result = await this.ytmusic.search("Never gonna give you up");
    console.log(result);
    return this.lastSearchCall = result;
  }

  public async sendSearchRequest(q: string) {
    const url = new URL('https://deezerdevs-deezer.p.rapidapi.com/search');
    url.searchParams.append('q', q);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      }
    });
    const result = await response.json();
    return this.lastSearchCall = result;
  }

  public musicPreview(data: any) {
    if (this.audioElement) {
      gsap.fromTo(this.audioElement!, { volume: maxVolume }, { volume: 0, duration: 5, ease: "power2.out" })
        /* .then(() => {
          this.audioElement!.pause();
        }); */
    }

    this.audioElement = new Audio(data.preview);
    this.audioElement.currentTime = 0;
    this.audioElement.play();

    gsap.fromTo(this.audioElement!, { volume: 0 }, { volume: maxVolume, duration: 5, ease: "power2.out" });
  }
}
