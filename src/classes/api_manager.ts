import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Track } from '../types';
import { AudioManager } from './audio_manager';
import { FastAverageColor } from 'fast-average-color';

export class APIManager {
  public audioManagers: AudioManager[] = [];
  public supabase: SupabaseClient;
  public supabaseURL: URL = new URL(import.meta.env.VITE_SB_URL);
  public supabaseKey: string = import.meta.env.VITE_SB_KEY;
  
  constructor() {
    this.supabase = createClient(this.supabaseURL.toString(), this.supabaseKey);
  }

  public async sendSearchRequest(q: string): Promise<JSON> {
    const url = new URL('https://deezerdevs-deezer.p.rapidapi.com/search');
    url.searchParams.append('q', q);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
      }
    });
    const result = await response.json();
    return result.data;
  }

  public async getBestTrack(rawSearchRequest: any) {
    if (!rawSearchRequest && rawSearchRequest.length === 0) 
      return;

    const bestTrackID = rawSearchRequest.data[0].id;
    console.log(rawSearchRequest)
    const url = new URL(`https://deezerdevs-deezer.p.rapidapi.com/track/${bestTrackID}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
      }
    });
    const result = await response.json();
    console.log(result)

    const color = (await new FastAverageColor().getColorAsync(result.album.cover_xl)).hex.replace('#', '');

    return {
       dzid: result.id,
       title: result.title,
       link: result.link,
       color,
       duration: result.duration,
       album_cover: result.album.cover_xl,
       album_title: result.album.title,
       release_date: result.release_date,
       artist_name: result.artist.name
     } as Track;
  }

  public async musicPreview(track: Track) {
    const url = new URL(`https://deezerdevs-deezer.p.rapidapi.com/track/${track.dzid}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
      }
    });
    const result = await response.json();

    this.stopMusicPreviews();
    this.audioManagers.push(new AudioManager(result.preview, (manager?: AudioManager) => {
      this.audioManagers = this.audioManagers.filter((item) => item !== manager);
    }));
  }

  public stopMusicPreviews() {
    this.audioManagers.forEach((value) => {
      value.fadeOut();
    })
    this.audioManagers = [];
  }

  public setPreviewVolume(volume: number) {
    this.audioManagers.forEach((audioManager) => {
      audioManager.updateVolume(volume);
    });
  }

  public async putInDatabase(track: Track) {
    const { error } = await this.supabase
      .from('tracks')
      .insert(track)
    
    if(error) {
      console.error('Error inserting track:', error);
    }
  }

  public async getTrackDatabase() {
    const { data, error } = await this.supabase
      .from('tracks')
      .select()

    console.log(data, error)
    return data as Track[];
  }

  public async removeFromDatabase(track: Track) {
    const { error } = await this.supabase
      .from('tracks')
      .delete()
      .eq('dzid', track.dzid);
    if(error) {
      console.error('Error deleting track:', error);
    }
  }

}
