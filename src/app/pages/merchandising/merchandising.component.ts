import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MerchService } from '../../services/merch.service';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MerchItem } from '../../models/merch-item.model'; 
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-merchandising',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchandising.component.html',
  styleUrls: ['./merchandising.component.css'],
})
export class MerchandisingComponent implements OnInit {
  articles: MerchItem[] = [];
  favorites: string[] = [];
  userId: string | null = null;

  isLoading = false;
  errorMessage: string | null = null;

  selectedSort: 'name' | 'createdAt' | 'price' | null = null;
  searchQuery = '';

  private authService = inject(AuthService);
  userRole$: Observable<string | null> = this.authService.userRole$;
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;

  constructor(
    private merchService: MerchService,
    private favService: FavoritesService,
    private router: Router,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.loadMerch();
  }

  private loadMerch(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.merchService.getMerchItems({ sort: this.selectedSort || undefined }).subscribe({
      next: (response) => {
        this.articles = response.data;
        this.isLoading = false;
        this.loadFavorites();
      },
      error: (err) => {
        console.error('[Merchandising] Error cargando merch', err);
        this.errorMessage = 'Error cargando productos de merchandising';
        this.isLoading = false;
      },
    });
  }

  private loadFavorites(): void {
    if (this.userId) {
      this.favService.getFavorites(this.userId).subscribe({
        next: (res: any) => {
          this.favorites = res.data.map((fav: any) => fav.merchId ?? fav.id);
        },
        error: (err) => {
          console.error('Error al cargar favoritos', err);
        },
      });
    }
  }

  sortBy(criteria: 'name' | 'price' | 'createdAt') {
    this.selectedSort = this.selectedSort === criteria ? null : criteria;
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

  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  toggleFavorite(article: MerchItem, event: Event) {
    event.stopPropagation();
    if (!this.userId) {
      alert('Debes iniciar sesión');
      return;
    }

    const action = this.isFavorite(article.id)
      ? this.favService.deleteMerchFromFavorites(this.userId, article.id)
      : this.favService.addMerchToFavorites(this.userId, article.id);

    action.subscribe(() => this.loadFavorites());
  }

  isInCart(id: string): boolean {
    return this.cart['itemsSubject'].value.some(
      i=> i.itemType === 'merch' && String(i.id) === String(id)
    );
  }

  toggleCart(item: MerchItem, event: Event) {
    event.stopPropagation();
    if(this.isInCart(item.id)){
      const cartItem = this.cart['itemsSubject'].value.find(
        i=> i.itemType === 'merch' && String(i.id) === String(item.id)
      );
      if(cartItem) {
        this.cart.remove(cartItem);
      }
    }
    else {
      this.cart.addMerch(item);
    }
  }
  addToCart(item: MerchItem) {
    this.cart.addMerch(item);
  }
}
