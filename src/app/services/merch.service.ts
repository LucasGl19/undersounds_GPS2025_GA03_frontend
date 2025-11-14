import { Injectable } from '@angular/core';
import { MerchItem } from '../models/merch-item.model';

@Injectable({
  providedIn: 'root'
})
export class MerchService {
  private merchItems: MerchItem[] = [
    {
      id: 1,
      name: 'Taza esmaltada',
      price: '12 €',
      description: 'Perfecta para sesiones nocturnas de mezcla o para tu café matutino.',
      image: 'assets/images/merch/merch-mug.svg',
      createdAt: '05/02/2021',
      artistId: 1,
    },

    {
      id: 2,
      name: 'Camiseta “Waves”',
      price: '22 €',
      description: 'Algodón orgánico con impresión serigráfica de edición limitada.',
      image: 'assets/images/merch/merch-shirt.svg',
      createdAt: '10/11/2020',
      artistId: 1,
    },

    {
      id: 3,
      name: 'Tote bag “UnderSounds”',
      price: '15 €',
      description: 'Bolsa resistente para llevar vinilos, cassettes y equipos ligeros.',
      image: 'assets/images/merch/merch-tote.svg',
      createdAt: '22/03/2021',
      artistId: 1,
    },
  ];

  getMerchItems(): MerchItem[] {
    return this.merchItems;
  }
  getArtistMerch(id: number | null) : MerchItem[]{
    if(!id){
      return [];
    }
    return this.merchItems.filter(i => i.artistId === id);
  }
  constructor() { }
}
