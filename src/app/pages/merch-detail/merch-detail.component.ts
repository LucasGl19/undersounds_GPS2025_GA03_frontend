import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MerchItem } from '../../models/merch-item.model';
import { MerchService } from '../../services/merch.service';
import { CommonModule } from '@angular/common';
import { CommentBoxComponent } from '../../components/comment-box/comment-box.component';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArtistsService } from '../../services/artists.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-merch-detail',
  templateUrl: './merch-detail.component.html',
  imports: [CommonModule, RouterModule, CommentBoxComponent],
  styleUrls: ['./merch-detail.component.css'],
})
export class MerchDetailComponent implements OnInit {
  merch: MerchItem | null = null;
  isLoading: boolean = false;
  errorMsg: string = '';
  artistName: string | null = null;
  artistLinkId: string | null = null; // id para routerLink /artist/:id (numérico)
  private cartService = inject(CartService);
  private snack = inject(MatSnackBar);
  private artistsService = inject(ArtistsService);

  buttonText : String = "Añadir al carrito"
  isInCart : boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchService: MerchService
  ) {}

  ngOnInit(): void {
    const merchId = this.route.snapshot.paramMap.get('id');
    if (!merchId) {
      this.errorMsg = 'No se especificó un artículo de merchandising';
      return;
    }
    this.loadMerchItem(merchId);
  }

  loadMerchItem(id: string) {
    this.isLoading = true;
    this.errorMsg = '';
    this.merchService.getMerchItemById(id).subscribe({
      next: (response) => {
        this.merch = response.data;
        this.isLoading = false;
        this.resolveArtist();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/merchandising']);
  }

  formatPrice(cents: number, currency: string) {
    if (cents === 0 || cents == null) return 'Gratis';
    return `${(cents / 100).toFixed(2)} ${currency ?? 'EUR'}`;
  }

  isInStock(): boolean {
    return !!this.merch?.stock && this.merch.stock > 0;
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  addMerchToCart() {
    if (!this.merch) return;
    this.cartService.addMerch(this.merch);
        this.buttonText = "Artículo añadido";
    this.isInCart = true;
    this.snack
      .open('Artículo añadido al carrito', 'Ver', { duration: 3000 })
      .onAction()
      .subscribe(() => this.router.navigate(['/cart']));
  }

  private resolveArtist() {
    if (!this.merch) return;
    const id = this.merch.artistId;
    if (!id) {
      this.artistName = null;
      this.artistLinkId = null;
      return;
    }
    // Sólo resolvemos si el id es numérico, igual que en song-player/album
    const idStr = String(id);
    if (!/^\d+$/.test(idStr)) {
      this.artistName = null;
      this.artistLinkId = null;
      return;
    }
    this.artistsService
      .getArtistById(idStr)
      .pipe(catchError(() => of(null)))
      .subscribe((artist) => {
        if (artist) {
          this.artistName = artist.name || artist.username || null;
          this.artistLinkId = idStr;
        }
      });
  }
}
