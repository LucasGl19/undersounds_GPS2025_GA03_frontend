import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, PaginatedAlbumResponse, PaginatedTrackResponse } from '../../services/api.service';
import { ArtistsService } from '../../services/artists.service';
import { Artist } from '../../models/artist.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  private apiService = inject(ApiService);
  private artistsService = inject(ArtistsService);

  newAlbums: any[] = [];
  topTracks: any[] = [];
  featuredArtists: Artist[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // 1. Fetch Albums
    const albums$ = this.apiService.getAlbums({ limit: 4, releaseState: 'published' }).pipe(
      catchError(err => {
        console.error('Error loading albums', err);
        return of({ data: [], meta: { page: 1, limit: 4, total: 0 } } as PaginatedAlbumResponse);
      })
    );

    // 2. Fetch Tracks
    const tracks$ = this.apiService.getTracks({ limit: 5, sort: 'playCount', order: 'desc' }).pipe(
      catchError(err => {
        console.error('Error loading tracks', err);
        return of({ data: [], meta: { page: 1, limit: 5, total: 0 } } as PaginatedTrackResponse);
      })
    );

    // 3. Fetch Featured Artists (Search)
    const artists$ = this.artistsService.searchArtists('', 1, 4).pipe(
      catchError(err => {
        console.error('Error loading artists', err);
        return of({ items: [] } as any);
      })
    );

    forkJoin([albums$, tracks$, artists$]).subscribe(([albumsRes, tracksRes, artistsRes]) => {
      this.newAlbums = albumsRes.data || [];
      this.topTracks = tracksRes.data || [];
      
      // Process Artists
      if (artistsRes.items && artistsRes.items.length > 0) {
         this.featuredArtists = artistsRes.items.map((user: any) => ({
             id: String(user.id),
             name: user.name || user.username,
             image: user.avatarUrl || user.avatar_url || 'assets/images/artists/default-artist.svg',
             genre: 'Artist', 
             bio: user.bio
         }));
      } else {
         this.featuredArtists = this.artistsService.getArtists().slice(0, 3);
      }

      // Resolve Artist Names for Albums and Tracks
      const artistIds = new Set<string>();
      this.newAlbums.forEach(a => { if(a.artistId) artistIds.add(a.artistId); });
      this.topTracks.forEach(t => { 
        if(t.artistId) artistIds.add(t.artistId); 
        // Also check album.artistId if track.artistId is missing
        if(!t.artistId && t.album?.artistId) artistIds.add(t.album.artistId);
      });

      // Fetch names for these IDs
      const ids = Array.from(artistIds);
      if (ids.length > 0) {
        const nameRequests = ids.map(id => 
          this.artistsService.getArtistById(id).pipe(
            catchError(() => of({ id, name: 'Artista' } as Artist))
          )
        );

        forkJoin(nameRequests).subscribe(artists => {
          const artistMap = new Map<string, string>();
          artists.forEach(a => {
            if (!a || !a.id) return;
            artistMap.set(a.id, a.name || 'Artista');
          });

          this.newAlbums.forEach(a => {
            if (a.artistId && artistMap.has(a.artistId)) {
              a.artistName = artistMap.get(a.artistId);
            }
          });

          this.topTracks.forEach(t => {
            const id = t.artistId || t.album?.artistId;
            if (id && artistMap.has(id)) {
              t.artistName = artistMap.get(id);
            }
          });
        });
      }

      // Fetch track stats to get playCount
      this.refreshTrackStats();

      this.loading = false;
    });
  }

  private refreshTrackStats(): void {
    this.topTracks.forEach(track => {
      if (track.id) {
        this.apiService.getTrackStats(track.id).subscribe({
          next: (res) => {
            if (res?.data?.playCount !== undefined) {
              track.playCount = res.data.playCount;
            }
          },
          error: () => {
            // Silently fail, keep existing value
          }
        });
      }
    });
  }
}
