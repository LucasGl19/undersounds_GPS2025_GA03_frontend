type MerchItem = {
  name: string;
  price: string;
  description: string;
  image: string;
};

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchandising',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchandising.component.html',
  styleUrl: './merchandising.component.css',
})
export class MerchandisingComponent {
  readonly articles: MerchItem[] = [
    {
      name: 'Camiseta “Waves”',
      price: '22 €',
      description: 'Algodón orgánico con impresión serigráfica de edición limitada.',
      image: 'assets/images/merch/merch-shirt.svg',
    },
    {
      name: 'Taza esmaltada',
      price: '12 €',
      description: 'Perfecta para sesiones nocturnas de mezcla o para tu café matutino.',
      image: 'assets/images/merch/merch-mug.svg',
    },
    {
      name: 'Tote bag “UnderSounds”',
      price: '15 €',
      description: 'Bolsa resistente para llevar vinilos, cassettes y equipos ligeros.',
      image: 'assets/images/merch/merch-tote.svg',
    },
  ];
}
