import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistStats {
  totalSales: number;
  totalPlays: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = `${environment.statsApiUrl}/v1/stats`;

   dummyStats = {
      totalSales: 1240,
      totalPlays: 58700
    };
    

  constructor(private http: HttpClient) { }

  getArtistStats(artistId: string): Observable<ArtistStats> {
    return this.http.get<ArtistStats>(`${this.apiUrl}/artist/${artistId}`);
  }
  
}
