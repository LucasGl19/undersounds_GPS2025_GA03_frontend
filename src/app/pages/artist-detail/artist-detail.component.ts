import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArtistsService } from '../../services/artists.service';
import { AlbumsService } from '../../services/albums.service';
import { SongsService } from '../../services/songs.service';
import { MerchService } from '../../services/merch.service';
import { Artist } from '../../models/artist.model';
import { Album } from '../../models/album.model';
import { SongCard } from '../../models/song-card.model';
import { MerchItem } from '../../models/merch-item.model';
import { forkJoin, switchMap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private artistsService = inject(ArtistsService);
  private albumsService = inject(AlbumsService);
  private songsService = inject(SongsService);
  private merchService = inject(MerchService);

  artist: Artist | null = null;
  albums: Album[] = [];
  songs: SongCard[] = [];
  merch: MerchItem[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          throw new Error('Artist ID not found');
        }
        this.loading = true;
        this.error = null;
        
        return forkJoin({
          artist: this.artistsService.getArtistById(id).pipe(
            catchError(err => {
              console.warn('Error fetching artist:', err);
              return of(null);
            })
          ),
          albums: this.albumsService.getAlbumArtistFromBackend(id).pipe(
            catchError(err => {
              console.warn('Error fetching albums:', err);
              return of([]);
            }),
            map(albums => {
              if (albums.length === 0) {
                const mockAlbums = this.albumsService.getAlbumArtist(id);
                if (mockAlbums.length > 0) return mockAlbums;
              }
              return albums;
            })
          ),
          songs: this.songsService.getTracksFromBackend({ artistId: id, limit: 5 }).pipe(
            map(res => res.tracks),
            catchError(err => {
              console.warn('Error fetching songs:', err);
              return of([]);
            }),
            map(songs => {
              if (songs.length === 0) {
                const mockSongs = this.songsService.getArtistSongs(id);
                if (mockSongs.length > 0) return mockSongs.slice(0, 5);
              }
              return songs;
            })
          ),
          merch: this.merchService.getArtistMerch(id as any).pipe(
            map(res => res.data),
            catchError(err => {
              console.warn('Error fetching merch:', err);
              return of([]);
            })
          )
        });
      })
    ).subscribe({
      next: (data) => {
        console.log('Artist Detail Data:', data); // Debug log
        if (!data.artist) {
          this.error = 'Artista no encontrado.';
        } else {
          this.artist = data.artist;
          this.albums = data.albums;
          this.songs = data.songs;
          this.merch = data.merch;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading artist details', err);
        this.error = 'No se pudo cargar la información del artista.';
        this.loading = false;
      }
    });
  }
}
