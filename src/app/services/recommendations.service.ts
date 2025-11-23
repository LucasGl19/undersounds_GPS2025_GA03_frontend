import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Album {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  releaseState: string;
  artistId: string;
  labelId: string;
  price: number;
  currency: string;
  genres: string;
  coverImageUrl?: string;
  tracks?: any[] | null;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  private readonly baseUrl = 'http://localhost:8083/v1/recommendations';
  dummyRecomendations: Album[] = [
    {
      id: 'eefc7820-352f-4702-a3d9-322e096534c8',
      title: 'prueba',
      description: 'album de prueba ',
      releaseDate: '2028-10-10T00:00:00',
      releaseState: 'draft',
      artistId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      labelId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      price: 1.0,
      currency: 'EUR',
      genres: 'classical',
      tracks: null,
      createdAt: '2025-11-10T11:12:29.785',
      updatedAt: '2025-11-10T11:12:29.785',
    },
  ];

  constructor(private http: HttpClient) {}

  // Obtener recomendaciones específicas para un usuario
  getRecommendationsForUser(userId: string): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.baseUrl}/user/${userId}`);
    // return of(this.dummyRecomendations);
  }
}
