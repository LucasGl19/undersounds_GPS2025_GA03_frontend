import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Artist } from '../models/artist.model';
import { environment } from '../../environments/environment';

interface PagedUsers {
  items: any[];
  page: number;
  pageSize: number;
  total: number;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  private apiUrl = `${environment.usersApiUrl}/artists`;
  
  artists: Artist[] = [
   {
      id: '1',
      name: 'Luna Waves',
      genre: 'Ambient / Dreampop',
      bio: 'Paisajes sonoros grabados en analógico con un enfoque cinematográfico y delicado.',
      image: 'assets/images/artists/artist-1.svg',
      nationality: 'Spanish',
      createdAt: '19/02/2022',
    },
    {
      id: '2',
      name: 'Prisma Club',
      genre: 'Synthwave',
      bio: 'Productor barcelonés que mezcla ritmos retro con arreglos modernos para la pista.',
      image: 'assets/images/artists/artist-2.svg',
      nationality: 'English',
      createdAt: '02/01/2023',
    },
    {
      id: '3',
      name: 'The Valley',
      genre: 'Folk experimental',
      bio: 'Colectivo que trabaja con instrumentos tradicionales y capas orquestales.',
      image: 'assets/images/artists/artist-3.svg',
      nationality: 'French',   
      createdAt: '30/10/2024',   
    }
  ]
  constructor(private http: HttpClient) { }

  getArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Observable<Artist> {
    const mockArtist = this.artists.find(a => a.id === id);
    if (mockArtist) {
      return of(mockArtist);
    }
    const params = new HttpParams()
      .set('userId', id)
      .set('page', '1')
      .set('page_size', '1');

    return this.http.get<PagedUsers>(this.apiUrl, { params }).pipe(
      map(response => {
        const artist = response.items?.[0];
        if (!artist) {
          throw new Error('Artista no encontrado');
        }
        return this.mapUserToArtist(artist);
      })
    );
  }

  searchArtists(query: string, page: number = 1, pageSize: number = 20, sortBy: string = 'name', sortOrder: string = 'asc'): Observable<PagedUsers> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }

    return this.http.get<PagedUsers>(this.apiUrl, { params });
  }

  private mapUserToArtist(user: any): Artist {
    return {
      id: String(user.id),
      username: user.username || user.name,
      name: user.name || user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl || user.avatar_url,
      role: user.role,
      createdAt: user.createdAt || user.created_at,
      nationality: user.nationality
    };
  }
}
