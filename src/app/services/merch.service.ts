import { inject, Injectable } from '@angular/core';
import { MerchItem } from '../models/merch-item.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type MerchType =
  | 'camiseta'
  | 'hoody'
  | 'hoodie'
  | 'vinilo'
  | 'cd'
  | 'poster'
  | 'pegatina'
  | 'otro';

interface MerchFilters {
  page?: number;
  limit?: number;
  artistId?: number;
  type?: MerchType;
  sort?: 'name' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
  q?: string;
}

interface PaginatedMerchResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MerchService {
  private http = inject(HttpClient);
  private apiUrl: string = 'http://localhost:8081/merch';
  // private merchItems: MerchItem[] = [
  //   {
  //     id: "1",
  //     title: 'Taza esmaltada',
  //     priceCents: 1200,
  //     description:
  //       'Perfecta para sesiones nocturnas de mezcla o para tu café matutino.',
  //     cover: { url: 'assets/images/merch/merch-mug.svg' },
  //     createdAt: '05/02/2021',
  //     artistId: 1,
  //   },

  //   {
  //     id: 2,
  //     name: 'Camiseta “Waves”',
  //     price: '22 €',
  //     description:
  //       'Algodón orgánico con impresión serigráfica de edición limitada.',
  //     image: 'assets/images/merch/merch-shirt.svg',
  //     createdAt: '10/11/2020',
  //     artistId: 1,
  //   },

  //   {
  //     id: 3,
  //     name: 'Tote bag “UnderSounds”',
  //     price: '15 €',
  //     description:
  //       'Bolsa resistente para llevar vinilos, cassettes y equipos ligeros.',
  //     image: 'assets/images/merch/merch-tote.svg',
  //     createdAt: '22/03/2021',
  //     artistId: 1,
  //   },
  // ];

  getMerchItems(filters?: MerchFilters): Observable<PaginatedMerchResponse> {
    let params: any = {};
    if (filters) {
      Object.keys(filters).forEach((key) => {
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
    return this.http.get<PaginatedMerchResponse>(`${this.apiUrl}`, {
      params,
    });
  }

  getMerchItemById(id: string): Observable<{ data: MerchItem }> {
    return this.http.get<{ data: MerchItem }>(`${this.apiUrl}/${id}`);
  }
  
  
  
  getArtistMerch(id: number | null): Observable<PaginatedMerchResponse> {
    return this.http.get<PaginatedMerchResponse>(`${this.apiUrl}?artistId=${id}`);
  }
  constructor() {}
}
