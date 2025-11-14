type MerchItem = {
  name: string;
  price: string;
  description: string;
  image: string;
  createdAt: string;
};

import { Component, OnInit, Query } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchService } from '../../services/merch.service';

@Component({
  selector: 'app-merchandising',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchandising.component.html',
  styleUrl: './merchandising.component.css',
})
export class MerchandisingComponent implements OnInit{
  articles: MerchItem[] = [];
  selectedSort: 'name' | 'createdAt' | null = null;
  searchQuery: string = '';
  constructor(private merchService: MerchService) {}

  ngOnInit(): void {
    this.articles = this.merchService.getMerchItems();
  }

    sortBy(criteria: 'name' | 'createdAt') {
  if (this.selectedSort === criteria) {
    this.selectedSort = null;
    this.articles = this.merchService.getMerchItems(); 
    return;
  }

  this.selectedSort = criteria;

  this.articles = [...this.articles].sort((a, b) => {
    if (criteria === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (criteria === 'createdAt') {
      return new Date(a.createdAt ?? 0).getTime() -
             new Date(b.createdAt ?? 0).getTime();
    }
    return 0;
  });
}
  searchArticles() {
    const query = this.searchQuery.trim().toLowerCase();
    if(!query) {
      this.articles = this.merchService.getMerchItems();
      return;
    }

      this.articles = this.articles.filter(a => a.name.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
  );
    
  }

}
