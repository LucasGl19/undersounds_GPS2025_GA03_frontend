import { Injectable } from '@angular/core';
import { SongCard } from '../models/song-card.model';
@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private songs: SongCard[] = [
    {
      id: 1,
      title: 'Ocean Echoes',
      artist: 'Luna Waves',
      description: 'Ambient etéreo grabado en cinta con texturas analógicas y voces soñadoras.',
      format: 'Álbum digital',
      price: '7 €',
      image: 'assets/images/covers/cover-ambient.svg',
      audio: 'assets/audio/ocean_echoes.mp3',
      durationSec: 320,
      createdAt: '15/05/2022',
      
    },
    {
      id: 2,
      title: 'Noches de neón',
      artist: 'Club Prisma',
      description: 'Synthwave nocturno inspirado en paseos urbanos y luces neón interminables.',
      format: 'Cassette edición limitada',
      price: '11 €',
      image: 'assets/images/covers/cover-synth.svg',
      audio: 'assets/audio/noches_de_neon.mp3',
      durationSec: 285,
      createdAt: '08/09/2023',
    },
    {
      id: 3,
      title: 'Café de medianoche',
      artist: 'La Pluie',
      description: 'Beats lofi cálidos para estudiar, relajarse o escapar de la lluvia.',
      format: 'Streaming + descarga',
      price: 'Nombre tu precio',
      image: 'assets/images/covers/cover-lofi.svg',
      audio: 'assets/audio/cafe_de_medianoche.mp3',
      durationSec: 240,
      createdAt: '12/01/2023',
    },
    {
      id: 4,
      title: 'Sueños en Super 8',
      artist: 'Aurora Fade',
      description: 'Shoegaze nebuloso con capas de guitarras y voces reverberadas.',
      format: 'Vinilo de 12"',
      price: '18 €',
      image: 'assets/images/covers/cover-dream.svg',
      audio: 'assets/audio/suenos_en_super8.mp3',
      durationSec: 360,
      createdAt: '05/06/2022',
    },
    {
      id: 5,
      title: 'Luz primera',
      artist: 'Valle Naciente',
      description: 'Folk experimental con arreglos orquestales y grabaciones de campo.',
      format: 'CD artesanal',
      price: '12 €',
      image: 'assets/images/covers/cover-sunrise.svg',
      audio: 'assets/audio/luz_primera.mp3',
      durationSec: 275,
      createdAt: '22/11/2020',
    },
    {
      id: 6,
      title: 'Ritmo subterráneo',
      artist: 'BPM95',
      description: 'House profundo directo desde la escena independiente latinoamericana.',
      format: 'Descarga + stems',
      price: '9 €',
      image: 'assets/images/covers/cover-club.svg',
      audio: 'assets/audio/ritmo_subterraneo.mp3',
      durationSec: 310,
      createdAt: '30/03/2022',
    },
  ];

  getSongs(): SongCard[] {
    return this.songs;
  }

  getSongById(id: number): SongCard | undefined {
    return this.songs.find(song => song.id === id);
  }

}
