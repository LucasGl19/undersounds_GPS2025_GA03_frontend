export interface MerchItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priceCents: number;
  currency?: string;
  stock?: number;
  sku?: string;
  active?: boolean;
  artistId?: number | null;
  labelId?: number | null;
  coverId?: string | null;
  createdAt: string;
  updatedAt: string;
  artist?: any;
  label?: any;
  cover?: { url: string } | null;
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchService } from '../../services/merch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchandising',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchandising.component.html',
  styleUrls: ['./merchandising.component.css'],
})
export class MerchandisingComponent implements OnInit {
  articles: MerchItem[] = [];
  isLoading: boolean = false;

  selectedSort: 'name' | 'createdAt' | 'price' | null = null;
  searchQuery: string = '';
  constructor(private merchService: MerchService, private router: Router) {}

  ngOnInit(): void {
    this.merchService.getMerchItems().subscribe({
      next: (response) => {
        this.articles = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  sortBy(criteria: 'name' | 'price' | 'createdAt') {
    if (this.selectedSort === criteria) {
      this.selectedSort = null;
      this.merchService.getMerchItems().subscribe((response) => {
        this.articles = response.data;
      });
      return;
    }

    this.selectedSort = criteria;

    this.articles = [...this.articles].sort((a, b) => {
      if (criteria === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (criteria === 'createdAt') {
        return (
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime()
        );
      }
      if (criteria === 'price') {
        return a.priceCents - b.priceCents;
      }
      return 0;
    });
  }
  searchArticles() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.merchService.getMerchItems().subscribe((response) => {
        this.articles = response.data;
      });
      return;
    }

    this.articles = this.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.description?.toLowerCase().includes(query)
    );
  }
  navigateToMerchDetail(id: string) {
    this.router.navigate(['/merchandising', id]);
  }
}
