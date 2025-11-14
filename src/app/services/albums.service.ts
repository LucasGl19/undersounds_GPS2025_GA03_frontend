import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

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

  getAlbumArtist(id: number): Album[] {
    return this.albums.filter(a => a.artistId === id);
  }
}
