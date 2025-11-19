import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      name: 'Luna Waves',
      genre: 'Ambient / Dreampop',
      bio: 'Paisajes sonoros grabados en analógico con un enfoque cinematográfico y delicado.',
      image: 'assets/images/artists/artist-1.svg',
      nationality: 'Spanish',
      createdAt: '19/02/2022',
    },
    {
      name: 'Prisma Club',
      genre: 'Synthwave',
      bio: 'Productor barcelonés que mezcla ritmos retro con arreglos modernos para la pista.',
      image: 'assets/images/artists/artist-2.svg',
      nationality: 'English',
      createdAt: '02/01/2023',
    },
    {
      name: 'The Valley',
      genre: 'Folk experimental',
      bio: 'Colectivo que trabaja con instrumentos tradicionales y capas orquestales.',
      image: 'assets/images/artists/artist-3.svg',
      nationality: 'French',   
      createdAt: '30/10/2024',   
    },
  ]
  constructor(private http: HttpClient) { }

  getArtists(): Artist[] {
    return this.artists;
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
}
