import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.contentApiUrl;

export interface AlbumCreateDto {
  title: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;          // 'EUR', 'USD', etc.
  releaseDate?: string | null;       // 'YYYY-MM-DD'
  genres?: string[];                 // el backend admite array -> lo normaliza a CSV
  tags?: string[];                   // idem
  // Extras opcionales admitidos por el backend:
  coverUrl?: string;                 // si lo envías, te crea una Image mínima
  artistId: string;                  // requerido: ID del usuario autenticado
  labelId?: string;                  // opcional - no se incluye si no tiene valor
}

export interface TrackMinimal {
  title: string;
  durationSec?: number | null;
  trackNumber?: number | null;
}

export interface TrackCreateDto {
  title: string;
  albumId: string;                   // requerido por el backend
  durationSec?: number | null;
  trackNumber?: number | null;
  audio?: { codec?: string | null; bitrate?: number | null; url: string }; // opcional
  lyrics?: { language?: string | null; text: string };                      // opcional
}

export interface TrackFilters {
  page?: number;
  limit?: number;
  include?: string[];
  albumId?: string;
  artistId?: string;
  labelId?: string;
  genre?: string;
  tag?: string;
  language?: string;
  minDurationSec?: number;
  maxDurationSec?: number;
  releasedFrom?: string;  // formato: YYYY-MM-DD
  releasedTo?: string;    // formato: YYYY-MM-DD
  sort?: 'title' | 'durationSec' | 'playCount';
  order?: 'asc' | 'desc';
  q?: string;
}

export interface PaginatedTrackResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AlbumFilters {
  page?: number;
  limit?: number;
  include?: string[];
  artistId?: string;
  labelId?: string;
  genre?: string;
  tag?: string;
  releaseState?: string;
  q?: string;
}

export interface PaginatedAlbumResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // --------- ALBUMS ----------
  createAlbum(body: AlbumCreateDto): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/albums`, body);
  }

  // Obtener álbumes con filtros
  getAlbums(filters?: AlbumFilters): Observable<PaginatedAlbumResponse> {
    let params: any = {};
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params[key] = value.join(',');
          } else {
            params[key] = value.toString();
          }
        }
      });
    }

    return this.http.get<PaginatedAlbumResponse>(`${API}/albums`, { params });
  }

  // Añadir varias pistas a un álbum
  addTracksToAlbum(albumId: string, tracks: TrackMinimal[]): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/albums/${albumId}/tracks`, { tracks });
  }

  // Obtener un álbum específico por ID
  getAlbumById(albumId: string): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${API}/albums/${albumId}`);
  }

  // --------- TRACKS ----------
  createTrack(body: TrackCreateDto): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/tracks`, body);
  }

  // Obtener tracks con filtros
  getTracks(filters?: TrackFilters): Observable<PaginatedTrackResponse> {
    let params: any = {};
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params[key] = value.join(',');
          } else {
            params[key] = value.toString();
          }
        }
      });
    }

    console.log('[ApiService] getTracks called with params:', params);

    return this.http.get<PaginatedTrackResponse>(`${API}/tracks`, { params });
  }

  // Obtener un track específico por ID
  // Nota: si no enviamos 'include', el backend incluye todas las relaciones por defecto
  getTrackById(trackId: string): Observable<{ data: any }> {
    return this.http.get<{ data: any }>(`${API}/tracks/${trackId}`);
  }

  // Subir archivo de audio para una pista
  uploadTrackAudio(trackId: string, formData: FormData): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/tracks/${trackId}/audio`, formData);
  }
}
