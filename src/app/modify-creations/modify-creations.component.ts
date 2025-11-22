import { Component, OnInit } from '@angular/core';
import { SongCard } from '../models/song-card.model';
import { Album } from '../models/album.model';
import { AuthService } from '../services/auth.service';
import { AlbumsService } from '../services/albums.service';
import { SongsService } from '../services/songs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modify-creations',
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-creations.component.html',
  styleUrl: './modify-creations.component.css'
})
export class ModifyCreationsComponent implements OnInit {
   artistSongs: SongCard[] = [] ;
   artistAlbums: Album[] = [];
   openedSongId: number | string | null = null;
   openedAlbumId: number | string | null = null;
   isLoading = true;
   errorMsg = '';

   constructor(
      private authService: AuthService, 
      private albumService: AlbumsService, 
      private songService: SongsService
   ){}

   ngOnInit(): void {
      // Obtener el perfil del usuario autenticado
      this.authService.me().subscribe({
        next: (profile) => {
          if (profile && profile.id) {
            this.loadArtistData(profile.id);
          } else {
            this.errorMsg = 'No se pudo obtener el ID del artista';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('[ModifyCreations] Error al obtener perfil:', err);
          this.errorMsg = 'Error al obtener el perfil del usuario';
          this.isLoading = false;
        }
      });
   }

   private loadArtistData(artistId: string): void {
      // Cargar álbumes del backend
      this.albumService.getAlbumArtistFromBackend(artistId).subscribe({
        next: (albums) => {
          this.artistAlbums = albums;
          console.log('[ModifyCreations] Álbumes cargados:', this.artistAlbums);
          
          // Obtener los IDs de los álbumes del artista
          const albumIds = albums.map(a => String(a.id));
          
          // Cargar todas las canciones del backend
          this.songService.getTracksFromBackend({ limit: 100 }).subscribe({
            next: (response) => {
              // Filtrar solo las canciones que pertenecen a los álbumes del artista
              this.artistSongs = response.tracks.filter(track => 
                albumIds.includes(String(track.albumId))
              );
              // Note: price editing is only in album editor; keep song.price as-is for display
              console.log('[ModifyCreations] Canciones cargadas:', this.artistSongs);
              this.isLoading = false;
            },
            error: (err) => {
              console.error('[ModifyCreations] Error al cargar canciones:', err);
              // Fallback a datos locales si falla el backend
              const allSongs = this.songService.getSongs();
              this.artistSongs = allSongs.filter(song => 
                albumIds.includes(String(song.albumId))
              );
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('[ModifyCreations] Error al cargar álbumes:', err);
          // Fallback a datos locales si falla el backend
          this.artistAlbums = this.albumService.getAlbumArtist(artistId);
          this.isLoading = false;
        }
      });
   }

   toggleSongEditor(id: number | string) {
      this.openedSongId = this.openedSongId == id? null : id;
   }

   toggleAlbumEditor(id: number | string) {
      this.openedAlbumId = this.openedAlbumId == id ? null : id;
   }

   saveSong(song: SongCard) {
    // Optimistic update: guardar cambios localmente y enviar al backend
    const original = { ...song } as SongCard;

    // Find index in local array
    const idx = this.artistSongs.findIndex(s => s.id === song.id);
    if (idx >= 0) {
      // Already modified in-place via ngModel; keep a copy for rollback
      // Call backend to update track
      const trackPayload: any = {
        title: song.title,
        durationSec: song.durationSec,
        trackNumber: song.trackNumber,
      };

      this.songService.updateTrack(song.id as number | string, trackPayload).subscribe({
        next: (updated) => {
          console.log('[ModifyCreations] Track updated on backend:', updated);
          // If backend returns updated track, refresh local item fields that come from track
          this.artistSongs[idx] = { ...this.artistSongs[idx], ...updated } as SongCard;
        },
        error: (err) => {
          console.error('[ModifyCreations] Error updating track:', err);
          // Rollback
          this.artistSongs[idx] = original;
        }
      });

      // Additionally, some fields like description, image or price belong to the album.
      // If user modified those, try to update the parent album.
      if ((song as any).albumId) {
        const albumId = (song as any).albumId;
        const albumUpdate: any = {};
        // Find the current album object to compare previous values (we can't rely on 'original' because ngModel mutates the object in-place)
        const albumObj = this.artistAlbums.find(a => String(a.id) === String(albumId));
        if (albumObj) {
          if (song.description !== albumObj.description) albumUpdate.description = song.description;
        } else {
          if (song.description !== original.description) albumUpdate.description = song.description;
        }
        // cover/image changes must be handled via the dedicated backend endpoint
        const coverChanged = (() => {
          if (albumObj && albumObj.cover) return song.image && song.image !== albumObj.cover;
          return song.image && song.image !== original.image;
        })();

        // Price editing is only handled in the album editor. Do not propagate
        // song.price changes to the album here.

        const aidx = this.artistAlbums.findIndex(a => String(a.id) === String(albumId));
        // Cover/image changes must be uploaded via the album upload form with a file.
        // Here we only patch album metadata; cover upload is not handled in this editor.
        if (!coverChanged) {
          if (Object.keys(albumUpdate).length > 0) {
            this.albumService.updateAlbum(albumId, albumUpdate).subscribe({
              next: (resp) => {
                console.log('[ModifyCreations] Album updated from song save:', resp);
                if (aidx >= 0 && resp) this.artistAlbums[aidx] = resp as Album;
              },
              error: (err) => console.warn('[ModifyCreations] Error updating album from song save:', err)
            });
          }
        }
      }
    }
   }

   saveAlbum(album: Album) {
    // Optimistic update for album
    const idx = this.artistAlbums.findIndex(a => a.id === album.id);
    const original = idx >= 0 ? { ...this.artistAlbums[idx] } : null;

    if (idx >= 0) {
      // call backend
      const payload: any = {
        title: album.title,
        description: album.description,
        // Ensure price is numeric for backend
        price:
          typeof album.price === 'number'
            ? album.price
            : (() => {
                const parsed = parseFloat(String(album.price).replace('€', '').replace(',', '.'));
                return Number.isFinite(parsed) ? parsed : undefined;
              })(),
        currency: album.currency,
        // NOTE: cover cannot be directly patched via this endpoint on the backend.
        // Use the dedicated cover endpoint instead if needed.
      };

      this.albumService.updateAlbum(album.id as number | string, payload).subscribe({
        next: (resp) => {
          console.log('[ModifyCreations] Album updated on backend:', resp);
          // resp is the normalized Album (from AlbumsService)
          if (resp) {
            this.artistAlbums[idx] = resp as Album;
          } else {
            this.artistAlbums[idx] = { ...this.artistAlbums[idx], ...payload } as Album;
          }
          // If user changed the cover locally, also try to call the cover endpoint to ensure a cover record exists
          if (album.cover && album.cover !== original?.cover) {
            this.albumService.uploadAlbumCover(album.id as number | string).subscribe({
              next: (a) => {
                if (a) this.artistAlbums[idx] = a as Album;
              },
              error: (err) => console.warn('[ModifyCreations] Error creating cover after album patch:', err)
            });
          }
        },
        error: (err) => {
          console.error('[ModifyCreations] Error updating album:', err);
          // rollback
          if (original) this.artistAlbums[idx] = original;
        }
      });
    }
   }
}
