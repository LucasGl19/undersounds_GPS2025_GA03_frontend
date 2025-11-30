import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistStats {
  totalSales: number;
  totalPlays: number;
}

export interface AlbumStats {
  albumPlays: number;
  albumSales: number;
  albumRate: number;
}

export interface MerchStats {
  merchSales: number;
  merchRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = `${environment.statsApiUrl}/v1/stats`;

  dummyStats = {
    totalSales: 1240,
    totalPlays: 58700,
  };

  constructor(private http: HttpClient) {}

  getArtistStats(artistId: string): Observable<ArtistStats> {
    return this.http.get<ArtistStats>(`${this.apiUrl}/artist/${artistId}`);
  }

  getAlbumStats(albumId: string): Observable<AlbumStats> {
    return this.http.get<any>(`${this.apiUrl}/album/${albumId}`);
  }

  getMerchStats(merchId: string): Observable<MerchStats> {
    return this.http.get<MerchStats>(`${this.apiUrl}/merch/${merchId}`);
  }
}
