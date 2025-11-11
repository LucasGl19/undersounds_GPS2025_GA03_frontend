type MerchItem = {
  name: string;
  price: string;
  description: string;
  image: string;
  createdAt: string;
};

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchandising',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchandising.component.html',
  styleUrl: './merchandising.component.css',
})
export class MerchandisingComponent implements OnInit{
  searchQuery: string = '';
  filteredArticles: MerchItem[] = [];
  readonly articles: MerchItem[] = [
    {
      name: 'Camiseta “Waves”',
      price: '22 €',
      description: 'Algodón orgánico con impresión serigráfica de edición limitada.',
      image: 'assets/images/merch/merch-shirt.svg',
      createdAt: '01/03/2023',
    },
    {
      name: 'Taza esmaltada',
      price: '12 €',
      description: 'Perfecta para sesiones nocturnas de mezcla o para tu café matutino.',
      image: 'assets/images/merch/merch-mug.svg',
      createdAt: '15/07/2023',
    },
    {
      name: 'Tote bag “UnderSounds”',
      price: '15 €',
      description: 'Bolsa resistente para llevar vinilos, cassettes y equipos ligeros.',
      image: 'assets/images/merch/merch-tote.svg',
      createdAt: '22/11/2022',
    },
  ];

    ngOnInit(): void {
      this.filteredArticles = this.articles;
    }

    searchArticles(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if(!query) {
      this.filteredArticles = this.articles;
      return;
    }
     this.filteredArticles = this.articles.filter(article =>
      article.name.toLowerCase().includes(query) 
    );
  }
}
