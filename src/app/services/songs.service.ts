import { Injectable } from '@angular/core';
import { SongCard } from '../models/song-card.model';
import { ApiService, TrackFilters } from './api.service';
import { Observable, map, of } from 'rxjs';

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
      artistId: 1,
      genre: 'Ambient',
      language: 'es',
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
      artistId: 2,
      genre: 'Synthwave',
      language: 'es',
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
      artistId: 6,
      genre: 'Lofi',
      language: 'instrumental',
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
      artistId: 4,
      genre: 'Shoegaze',
      language: 'en',
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
      artistId: 5,
      genre: 'Folk',
      language: 'es',
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
      artistId: 3,
      genre: 'House',
      language: 'instrumental',
    },
  ];

  constructor(private apiService: ApiService) {}

  // Método para obtener canciones (usa mock si no hay backend disponible)
  getSongs(): SongCard[] {
    return this.songs;
  }

  // Método para obtener canciones del backend con filtros
  getTracksFromBackend(filters?: TrackFilters): Observable<{ tracks: any[], pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    return this.apiService.getTracks(filters).pipe(
      map(response => ({
        tracks: response.data.map((track: any) => this.mapBackendTrackToSongCard(track)),
        pagination: {
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
          totalPages: Math.max(1, Math.ceil((response.meta.total || 0) / Math.max(1, response.meta.limit || 1)))
        }
      }))
    );
  }

  // Mapea un track del backend al modelo SongCard del frontend
  private mapBackendTrackToSongCard(track: any): SongCard {
    return {
      id: track.id,
      title: track.title || 'Sin título',
      artist: track.album?.artist?.name || track.album?.artistId || 'Artista desconocido',
      artistId: track.album?.artistId ? parseInt(track.album.artistId) : 0,
      description: track.album?.description || 'Sin descripción',
      format: 'Streaming digital',
      price: track.album?.price ? `${track.album.price} ${track.album.currency || 'EUR'}` : 'Gratis',
      image: track.album?.cover?.url || 'assets/images/covers/default-cover.svg',
      audio: track.audio?.url || '',  // <-- AQUÍ está la clave: extraer la URL del objeto audio
      durationSec: track.durationSec || 0,
      createdAt: track.createdAt ? new Date(track.createdAt).toLocaleDateString('es-ES') : '',
      albumId: track.albumId,
      labelId: track.album?.labelId,
      genre: track.genre || (track.album?.genres ? track.album.genres.split(',')[0]?.trim() : ''),
      genres: track.album?.genres ? track.album.genres.split(',').map((g: string) => g.trim()) : [],
      tag: track.album?.tags ? track.album.tags.split(',')[0]?.trim() : '',
      tags: track.album?.tags ? track.album.tags.split(',').map((t: string) => t.trim()) : [],
      language: track.lyrics?.language || '',
      releaseDate: track.album?.releaseDate ? new Date(track.album.releaseDate).toLocaleDateString('es-ES') : '',
      trackNumber: track.trackNumber,
      playCount: track.stats?.playCount || 0,
    };
  }

  getArtistSongs(id: number): SongCard[] {
    return this.songs.filter(song => song.artistId === id);
  }

  getSongById(id: number) {
    return this.songs.find(song => song.id === id);
  }

  // Obtener canción individual del backend por ID
  getTrackByIdFromBackend(trackId: string): Observable<SongCard> {
    return this.apiService.getTrackById(trackId, ['album', 'audio', 'lyrics', 'stats']).pipe(
      map(response => this.mapBackendTrackToSongCard(response.data))
    );
  }

}
