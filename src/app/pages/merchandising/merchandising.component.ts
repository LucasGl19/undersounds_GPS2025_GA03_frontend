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
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

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
  favorites: string[] = [];
  userId: string | null = null;
  selectedSort: 'name' | 'createdAt' | 'price' | null = null;
  searchQuery: string = '';

  constructor(private merchService: MerchService, private favService: FavoritesService,private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.auth.getUserId();
    this.merchService.getMerchItems().subscribe({
      next: (response) => {
        this.articles = response.data;
        this.isLoading = false;
        this.loadFavorites();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  loadFavorites() {
    if (this.userId) {
      this.favService.getFavorites(this.userId).subscribe({
        next: (res: any) => {
          this.favorites = res.data.map((fav: any) => fav.merchId ?? fav.id);
        },
        error: (err) => {
          console.error('Error al cargar favoritos', err);
        }
      });
    }
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

  isFavorite(id: string) {
    return this.favorites.includes(id);
  }

  toggleFavorite(article: MerchItem, event: Event) {
    event.stopPropagation();
    if(!this.userId) {
      alert("Debes inciar sesión");
      return;
    }
    if (this.isFavorite(article.id)) {
      this.favService.deleteMerchFromFavorites(this.userId, article.id).subscribe(() => {
        this.loadFavorites(); 
      });
    } else {
      this.favService.addMerchToFavorites(this.userId, article.id).subscribe(() => {
        this.loadFavorites(); 
      });
    }
  }
}
