import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Album } from '../../models/album.model';
import { SongCard } from '../../models/song-card.model';
import { ApiService } from '../../services/api.service';
import { AlbumsService } from '../../services/albums.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { CommentBoxComponent } from '../../components/comment-box/comment-box.component';
@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, CommentBoxComponent],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
})
export class AlbumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private albumsService = inject(AlbumsService);
  private cartService = inject(CartService);
  private snack = inject(MatSnackBar);

  buttonText : String = "Añadir al carrito"
  isInCart : boolean = false;

  album: Album | null = null;
  tracks: SongCard[] = [];
  isLoading = true;
  errorMsg = '';
  showDebugInfo = environment.showDebugInfo;

  private normalizeUrl(u?: string): string {
    if (!u) return 'assets/images/covers/album-default.png';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/')) return `${environment.contentApiUrl}${u}`;
    return `${environment.contentApiUrl}/${u}`;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const albumId = params['id'];
      if (albumId) {
        this.loadAlbumDetail(albumId);
      }
    });
  }

  private loadAlbumDetail(albumId: string): void {
    this.isLoading = true;
    this.errorMsg = '';

    console.log(
      '[AlbumDetailComponent] Starting to load album with ID:',
      albumId
    );

    // Obtener detalles del álbum
    this.apiService.getAlbumById(albumId).subscribe({
      next: (response: any) => {
        if (response.data) {
          // Mapear datos del backend al modelo
          this.album = {
            id: response.data.id,
            title: response.data.title || 'Sin título',
            description: response.data.description || '',
            artistId: response.data.artistId || '',
            releaseDate: response.data.releaseDate
              ? new Date(response.data.releaseDate).toLocaleDateString('es-ES')
              : '',
            releaseState: response.data.releaseState || 'draft',
            price: response.data.price || 0,
            currency: response.data.currency || 'EUR',
            genres: response.data.genres
              ? response.data.genres.split(',').map((g: string) => g.trim())
              : [],
            cover: this.normalizeUrl(response.data.cover?.url),
            artistName: response.data.artistName || 'Artista desconocido',
          };

          console.log('[AlbumDetailComponent] Album loaded:', this.album);

          // Obtener canciones del álbum
          this.loadAlbumTracks(albumId);
        }
      },
      error: (error: any) => {
        console.error('[AlbumDetailComponent] Error loading album:', error);
        this.errorMsg = 'No se pudo cargar el álbum';
        this.isLoading = false;
      },
    });
  }

  private loadAlbumTracks(albumId: string): void {
    console.log('[AlbumDetailComponent] Loading tracks for albumId:', albumId);

    this.apiService.getTracks({ albumId, limit: 100 }).subscribe({
      next: (response: any) => {
        console.log(
          '[AlbumDetailComponent] Response from getTracks:',
          response
        );

        // Mapear datos del backend al modelo SongCard y filtrar por albumId
        let tracks = (response.data || [])
          .filter((track: any) => {
            // Filtrar solo tracks que pertenezcan a este álbum
            return String(track.albumId) === String(albumId);
          })
          .map((track: any) => ({
            id: track.id,
            title: track.title || 'Sin título',
            artist: this.album?.artistName || 'Desconocido',
            description: track.description || '',
            image: track.coverUrl
              ? this.normalizeUrl(track.coverUrl)
              : track?.album?.cover?.url
              ? this.normalizeUrl(track.album.cover.url)
              : 'assets/images/covers/track-default.png',
            genre: track.genre || '',
            language: track.language || '',
            format: track.format || 'MP3',
            price: track.price ? `${track.price} EUR` : 'Gratis',
            durationSec: track.durationSec || 0,
            playCount: track.playCount || 0,
            audio: track.audio?.url || '',
            createdAt: track.createdAt || new Date().toISOString(),
            artistId: track.artistId || 0,
            albumId: track.albumId,
            trackNumber: track.trackNumber,
          })) as SongCard[];

        this.tracks = tracks;

        if (this.showDebugInfo) {
          console.log(
            '[AlbumDetailComponent] Filtered tracks for album ' + albumId + ':',
            this.tracks
          );
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        if (this.showDebugInfo) {
          console.error('[AlbumDetailComponent] Error loading tracks:', error);
        }
        // No mostramos error si no hay canciones, simplemente dejamos el array vacío
        this.isLoading = false;
      },
    });
  }

  navigateToSongPlayer(trackId: string | number): void {
    this.router.navigate(['song-player', trackId]);
  }

  goBack(): void {
    this.router.navigate(['/albums']);
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  addAlbumToCart(): void {
    if (!this.album) return;
    this.cartService.addAlbum(this.album);
    this.buttonText = "Álbum añadido";
    this.isInCart = true;
    this.snack
      .open('Álbum añadido al carrito', 'Ver', { duration: 3000 })
      .onAction()
      .subscribe(() => this.router.navigate(['/cart']));
  }

}
