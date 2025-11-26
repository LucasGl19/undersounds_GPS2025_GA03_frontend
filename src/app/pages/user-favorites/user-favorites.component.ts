import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-favorites',
  imports: [CommonModule],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css'
})
export class UserFavoritesComponent implements OnInit {
  
  userId: string | null = null;
  favMerch: any[] = [];
  favAlbums: any[] = [];
  private apiBase = environment.contentApiUrl;

  constructor(private auth: AuthService, private favService: FavoritesService){};
  ngOnInit(): void {
    this.userId = this.auth.getUserId();
    if(this.userId) {
      this.favService.getFavorites(this.userId).subscribe({
        next:(res: any) => this.favMerch = res.data ?? [],
        error: err => console.error('Error al cargar favoritos de merch', err)
      });

      this.favService.getAlbumFavorites(this.userId).subscribe({
        next: (res: any) => this.favAlbums = res.data ?? [],
        error: err => console.error('Error al cargar favoritos de álbumes', err)
      });
    }
  }

  // Resolve cover URL for both merch items and album favorites
  getImageUrl(entry: any): string {
    // entry can be a merch item (has .cover) or a favorite tuple (has .album)
    let cover;
    if (entry.album) {
      // Album favorite: use album.cover
      cover = entry.album.cover;
    } else if (entry.cover) {
      // Merch item: use cover directly
      cover = entry.cover;
    } else {
      return 'assets/images/covers/album-default.png';
    }

    if (!cover) return 'assets/images/covers/album-default.png';

    const url = typeof cover === 'string' ? cover : (cover.url || '');
    if (!url) return 'assets/images/covers/album-default.png';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${this.apiBase}${url}`;
    return `${this.apiBase}/${url}`;
  }

  // Toggle/remove album favorite from the favorites list (optimistic)
  
  
}
