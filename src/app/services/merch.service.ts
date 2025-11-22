import { inject, Injectable } from '@angular/core';
import { MerchItem } from '../models/merch-item.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

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
  artistId?: string;  // UUID string según OpenAPI
  type?: MerchType;
  sort?: 'name' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
  q?: string;
}

interface PaginatedMerchResponse {
  data: MerchItem[];
  meta: { page: number; limit: number; total: number };
}

export interface MerchCreateDto {
  name: string;               // obligatorio según backend
  description?: string | null;
  type: MerchType;            // obligatorio según backend
  price?: number | null;      // euros (backend convierte a cents)
  currency?: string | null;   // por defecto 'EUR'
  stock?: number | null;
  sku?: string | null;
  active?: boolean;           // por defecto true
  artistId?: string;          // id usuario/artist
  labelId?: string;           // opcional
  cover?: {                   // opcional al crear
    url?: string;
    alt?: string;
    width?: number | null;
    height?: number | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MerchService {
  private http = inject(HttpClient);
  private apiUrl: string = `${environment.contentApiUrl}/merch`;

  private normalizeUrl(u?: string): string | undefined {
    if (!u) return undefined;
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/')) return `${environment.contentApiUrl}${u}`;
    return `${environment.contentApiUrl}/${u}`;
  }
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
    return this.http.get<PaginatedMerchResponse>(`${this.apiUrl}`, { params }).pipe(
      map(resp => ({
        ...resp,
        data: (resp.data || []).map(item => ({
          ...item,
          cover: item.cover ? { ...item.cover, url: this.normalizeUrl(item.cover.url) as string } : item.cover
        }))
      }))
    );
  }

  getMerchItemById(id: string): Observable<{ data: MerchItem }> {
    return this.http.get<{ data: MerchItem }>(`${this.apiUrl}/${id}`).pipe(
      map(resp => ({
        data: resp.data ? {
          ...resp.data,
          cover: resp.data.cover ? { ...resp.data.cover, url: this.normalizeUrl(resp.data.cover.url) as string } : resp.data.cover
        } : resp.data
      }))
    );
  }

  getArtistMerch(id: number | null): MerchItem[] {
    if (!id) {
      return [];
    }
    // return this.merchItems.filter((i) => i.artistId === id);
    return [];
  }

  createMerch(body: MerchCreateDto): Observable<{ data: MerchItem }> {
    return this.http.post<{ data: MerchItem }>(this.apiUrl, body);
  }

  addMerchImage(merchId: string, file?: File): Observable<{ data: MerchItem }> {
    const form = new FormData();
    // El backend actual ignora el contenido y crea una imagen vacía, pero seguimos el contrato multipart
    if (file) form.append('file', file);
    return this.http.post<{ data: MerchItem }>(`${this.apiUrl}/${merchId}/images`, form).pipe(
      map(resp => ({
        data: resp.data ? {
          ...resp.data,
          cover: resp.data.cover ? { ...resp.data.cover, url: this.normalizeUrl(resp.data.cover.url) as string } : resp.data.cover
        } : resp.data
      }))
    );
  }

  // Nueva subida múltiple de imágenes (merch) usando campo 'files'
  uploadImages(merchId: string, formData: FormData): Observable<{ data: MerchItem }> {
    return this.http.post<{ data: MerchItem }>(`${this.apiUrl}/${merchId}/images`, formData).pipe(
      map(resp => ({
        data: resp.data ? {
          ...resp.data,
          cover: resp.data.cover ? { ...resp.data.cover, url: this.normalizeUrl(resp.data.cover.url) as string } : resp.data.cover
        } : resp.data
      }))
    );
  }

  updateMerch(merchId: string, body: any): Observable<{ data: MerchItem }> {
    return this.http.patch<{ data: MerchItem }>(`${this.apiUrl}/${merchId}`, body);
  }

  constructor() {}
}
