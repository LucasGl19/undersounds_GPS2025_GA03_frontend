import { Injectable, inject } from '@angular/core';
import { Album } from '../models/album.model';
import { ApiService } from './api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  private apiService = inject(ApiService);

  constructor() { }
  private albums: Album[] = [
    {
      id: 1,
      title: 'Ecos del Mar',
      description: 'Un viaje sonoro a través de paisajes acuáticos.',
      artistId: 2,
      releaseDate: '19/02/2004',
      releaseState: 'Publicado',
      price: 20,
      currency: 'EUR',
      genres: ['Pop', 'Electro'],
      cover: 'assets/images/covers/album1.png',
      artistName: 'Ecos del Rocío'
    },
    {
      id: 2,
      title: 'Sombras Urbanas',
      description: 'Beats oscuros y letras introspectivas.',
      artistId: 3,
      releaseDate: '211/07/2023',
      releaseState: 'Publicado',
      price: 15,
      currency: 'EUR',
      genres: ['Hip-hop', 'Trap'],
      cover: 'assets/images/covers/album2.png',
      artistName: 'Matt Hyden',
    },
    {
      id: 3,
      title: 'Groove Arcade',
      description: 'Groove en estado puro, disfruta del sonido de las percusiones infinitas.',
      artistId: 1,
      releaseDate: '09/08/2025',
      releaseState: 'Publicado',
      price: 12,
      currency: 'EUR',
      genres: ['Electronic', 'Techno'],
      cover: 'assets/images/covers/album3.png',
      artistName: 'Mapin',
    }

  ];

  getAlbum() {
    return this.albums;
  }

  getAlbumArtist(id: number | string): Album[] {
    // Primero intenta obtener del backend
    const artistIdStr = String(id);
    
    // Aquí hacemos una llamada síncrona, pero eventualmente esto debería ser async
    // Por ahora, retornamos los datos locales filtrados
    return this.albums.filter(a => a.artistId == id);
  }

  // Obtener álbumes del backend de forma async
  getAlbumArtistFromBackend(artistId: number | string) {
    return this.apiService.getAlbums({ 
      artistId: String(artistId),
      limit: 100 
    }).pipe(
      map(response => {
        // Mapear álbumes del backend al modelo Album del frontend
        return (response.data || []).map((album: any) => ({
          id: album.id,
          title: album.title || 'Sin título',
          description: album.description || '',
          artistId: album.artistId || artistId,
          releaseDate: album.releaseDate ? new Date(album.releaseDate).toLocaleDateString('es-ES') : '',
          releaseState: album.releaseState || 'draft',
          price: album.price || 0,
          currency: album.currency || 'EUR',
          genres: album.genres ? album.genres.split(',').map((g: string) => g.trim()) : [],
          cover: album.cover?.url || 'assets/images/covers/album-default.png',
          artistName: 'Artista desconocido'
        }));
      })
    );
  }

  saveAlbumAsFavorite(albumId: String) : void {
    console.log(`Álbum con ID ${albumId} guardado como favorito.`);
  }
}
