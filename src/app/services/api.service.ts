import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API = environment.apiUrl;

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
  artistId?: string;
  labelId?: string;
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

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // --------- ALBUMS ----------
  createAlbum(body: AlbumCreateDto): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/albums`, body);
  }

  // Añadir varias pistas a un álbum
  addTracksToAlbum(albumId: string, tracks: TrackMinimal[]): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/albums/${albumId}/tracks`, { tracks });
  }

  // --------- TRACKS ----------
  createTrack(body: TrackCreateDto): Observable<{ data: any }> {
    return this.http.post<{ data: any }>(`${API}/tracks`, body);
  }
}
