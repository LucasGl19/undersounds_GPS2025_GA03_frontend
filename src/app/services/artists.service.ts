import { Injectable } from '@angular/core';
import { Artist } from '../models/artist.model';
@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  artists: Artist[] = [
   {
      name: 'Luna Waves',
      genre: 'Ambient / Dreampop',
      bio: 'Paisajes sonoros grabados en analógico con un enfoque cinematográfico y delicado.',
      image: 'assets/images/artists/artist-1.svg',
      nationality: 'Spanish',
    },
    {
      name: 'Prisma Club',
      genre: 'Synthwave',
      bio: 'Productor barcelonés que mezcla ritmos retro con arreglos modernos para la pista.',
      image: 'assets/images/artists/artist-2.svg',
      nationality: 'English',
    },
    {
      name: 'The Valley',
      genre: 'Folk experimental',
      bio: 'Colectivo que trabaja con instrumentos tradicionales y capas orquestales.',
      image: 'assets/images/artists/artist-3.svg',
      nationality: 'French',      
    },
  ]
  constructor() { }

  getArtists(): Artist[] {
    return this.artists;
  }
}
