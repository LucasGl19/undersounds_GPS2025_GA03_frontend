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
            // The API expects comma-separated values for arrays like include
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
    return this.http.get<{ data: any }>(`${API}/albums/${albumId}?include=cover`);
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


  // Obtener estadísticas de reproducción de un track
  getTrackStats(trackId: string): Observable<{ data: { playCount: number } }> {
    return this.http.get<{ data: { playCount: number } }>(`${API}/tracks/${trackId}/stats`);
  
  }
  // Subir archivo de audio para una pista
  uploadTrackAudio(trackId: string, formData: FormData): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/tracks/${trackId}/audio`, formData);

  }

  // Crear pista con audio (multipart)
  createTrackWithAudio(formData: FormData): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/tracks`, formData);
  }
  
  // Eliminar una pista por ID
  deleteTrack(trackId: string): Observable<void> {
    return this.http.delete<void>(`${API}/tracks/${trackId}`);
  }
  
  // --------- UPDATES (PATCH) ----------
  // Actualizar álbum parcialmente
  updateAlbum(albumId: string, body: any): Observable<{ data: any }> {
    return this.http.patch<{ data: any }>(`${API}/albums/${albumId}`, body);
  }

  // Subir portada real para un álbum vía multipart
  uploadAlbumCover(albumId: string, file: File): Observable<{ data: any }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ data: any }>(`${API}/albums/${albumId}/cover`, fd);
  }

  // Eliminar un álbum por ID
  deleteAlbum(albumId: string): Observable<void> {
    return this.http.delete<void>(`${API}/albums/${albumId}`);
  }

  // Actualizar pista parcialmente
  updateTrack(trackId: string, body: any): Observable<{ data: any }> {
    return this.http.patch<{ data: any }>(`${API}/tracks/${trackId}`, body);
  }

  // Subir portada de una pista
  // (Eliminado) Las pistas no tienen portada propia; usan la del álbum.

  // Subir imágenes de merch (múltiples)
  uploadMerchImages(merchId: string, files: File[]): Observable<{ data: any }> {
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    return this.http.post<{ data: any }>(`${API}/merch/${merchId}/images`, fd);
  }
}
