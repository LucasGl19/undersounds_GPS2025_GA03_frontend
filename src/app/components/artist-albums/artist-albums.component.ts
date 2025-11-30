import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Album } from '../../models/album.model';
import { AlbumsService } from '../../services/albums.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-albums',
  imports: [CommonModule],
  templateUrl: './artist-albums.component.html',
  styleUrl: './artist-albums.component.css',
})
export class ArtistAlbumsComponent {
  @Input() artistId!: string | undefined;
  albums: Album[] = [];
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(private albumService: AlbumsService, private router: Router) {}

  ngOnInit() {
    if (!this.artistId) {
      this.errorMsg = 'ID de artista no proporcionado';
      this.isLoading = false;
      return;
    }

    this.albumService.getAlbumArtistFromBackend(this.artistId).subscribe({
      next: (response) => {
        this.albums = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching albums for artist', err);
        this.errorMsg = 'No se pudieron cargar los álbumes del artista.';
        this.isLoading = false;
      },
    });
  }

  navigateToAlbumPage(albumId: number) {
    this.router.navigate(['/album', albumId]);
  }
}
