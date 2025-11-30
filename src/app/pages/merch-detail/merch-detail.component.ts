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
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';
import { MerchStats, StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-merch-detail',
  templateUrl: './merch-detail.component.html',
  imports: [CommonModule, RouterModule, CommentBoxComponent, MatIconModule, MatDialogModule],
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
  private statsService = inject(StatsService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  isAdmin$: Observable<boolean> = this.authService.userRole$.pipe(
    map((role) => role === 'admin')
  );

  buttonText: String = 'Añadir al carrito';
  isInCart: boolean = false;
  merchStats: MerchStats | null = null;

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
    this.loadMerchStats(merchId);
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
    this.buttonText = 'Artículo añadido';
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

  loadMerchStats(merchId: string) {
    this.statsService.getMerchStats(merchId).subscribe({
      next: (stats) => {
        this.merchStats = stats;
      },
      error: (error: any) => {
        console.error(
          'Error al cargar las estadísticas de merchandising',
          error
        );
      },
    });
  }

  confirmDeleteMerch(): void {
    if (!this.merch) return;
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { name: this.merch.title },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok || !this.merch) return;
      this.merchService.deleteMerch(String(this.merch.id)).subscribe({
        next: () => {
          this.snack.open('Artículo de merch eliminado', undefined, {
            duration: 2000,
          });
          this.router.navigate(['/merchandising']);
        },
        error: (err) => {
          console.error('Error eliminando merch', err);
          this.snack.open('No se pudo eliminar el artículo', undefined, {
            duration: 3000,
          });
        },
      });
    });
  }
}
