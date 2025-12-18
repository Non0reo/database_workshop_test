import gsap from 'gsap';

export class APIManager {
  public lastSearchCall?: Object;
  public audioElement?: HTMLAudioElement;

  constructor() {
  }

  public async sendSearchRequest(q: string) {
    const url = new URL('https://deezerdevs-deezer.p.rapidapi.com/search');
    url.searchParams.append('q', q);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": "419e13ae6bmshdb5832294162af0p1b6561jsn3ddaf87119bc",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      }
    });
    const result = await response.json();
    return this.lastSearchCall = result;
  }

  public musicPreview(data: any) {
    if (this.audioElement) {
      gsap.fromTo(this.audioElement!, { volume: 1 }, { volume: 0, duration: 5, ease: "power2.out" })
        .then(() => {
          this.audioElement!.pause();
        });
    }

    this.audioElement = new Audio(data.preview);
    this.audioElement.play();

    gsap.fromTo(this.audioElement!, { volume: 0 }, { volume: 1, duration: 5, ease: "power2.out" });
  }
}
