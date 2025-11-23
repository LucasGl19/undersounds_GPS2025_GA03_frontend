import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private http = inject(HttpClient);
  private api = environment.contentApiUrl;

  constructor() {}

  getFavorites(userId: string) {
    return this.http.get(`${this.api}/users/${userId}/favorites/merch`);
  }

  addMerchToFavorites(userId: string, merchId: string) {
    return this.http.post(`${this.api}/users/${userId}/favorites/merch`, { merchId: merchId });
  }

  deleteMerchFromFavorites(userId: string, merchId: string) {
    return this.http.delete(`${this.api}/users/${userId}/favorites/merch/${merchId}`);
  }
}
