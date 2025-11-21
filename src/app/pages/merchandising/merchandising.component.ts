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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchService } from '../../services/merch.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

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
  errorMessage: string | null = null;

  selectedSort: 'name' | 'createdAt' | 'price' | null = null;
  searchQuery: string = '';
  
  private authService = inject(AuthService);
  userRole$: Observable<string | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private merchService: MerchService, private router: Router) {
    this.userRole$ = this.authService.userRole$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.loadMerch();
  }

  private loadMerch(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.merchService.getMerchItems({ sort: this.selectedSort || undefined }).subscribe({
      next: (response) => {
        this.articles = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[Merchandising] Error cargando merch', err);
        this.errorMessage = 'Error cargando productos de merchandising';
        this.isLoading = false;
      },
    });
  }

  sortBy(criteria: 'name' | 'price' | 'createdAt') {
    if (this.selectedSort === criteria) {
      this.selectedSort = null;
      this.loadMerch();
      return;
    }

    this.selectedSort = criteria;
    // Recargar desde API usando sort del backend (evitamos inconsistencias con paginación futura)
    this.loadMerch();
  }
  searchArticles() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.loadMerch();
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

  navigateToUploadMerch() {
    this.router.navigate(['/upload-merch']);
  }
}
