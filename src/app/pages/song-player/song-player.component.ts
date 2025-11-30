import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { ArtistsService } from '../../services/artists.service';
import { SongCard } from '../../models/song-card.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommentBoxComponent } from '../../components/comment-box/comment-box.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-song-player',
  imports: [CommonModule, RouterModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './song-player.component.html',
  styleUrl: './song-player.component.css'
})
export class SongPlayerComponent implements OnInit {
  song: SongCard | undefined;
  isLoading: boolean = true;
  errorMsg: string = '';
  @ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private authService = inject(AuthService);
  isAdmin$: Observable<boolean> = this.authService.userRole$.pipe(
    map((role) => role === 'admin')
  );
  
  constructor(
    private route: ActivatedRoute,
    private songService: SongsService,
    private api: ApiService,
    private artistsService: ArtistsService
  ){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Si es un número, buscar en mock
      const numericId = Number(id);
      if (!isNaN(numericId) && numericId > 0 && numericId < 1000) {
        this.song = this.songService.getSongById(numericId);
        if (this.song) {
          this.isLoading = false;
          return;
        }
      }
      
      // Si no es un número o no se encontró en mock, cargar desde backend
      this.loadSongFromBackend(id);
    } else {
      this.errorMsg = 'ID de canción no válido';
      this.isLoading = false;
    }
  }
  
  private loadSongFromBackend(trackId: string): void {
    this.isLoading = true;
    this.songService.getTrackByIdFromBackend(trackId).subscribe({
      next: (song) => {
        this.song = song;
        this.isLoading = false;
        this.resolveArtistName();
      },
      error: (error) => {
        console.error('Error al cargar la canción desde el backend:', error);
        this.errorMsg = 'No se pudo cargar la canción';
        this.isLoading = false;
      }
    });
  }

  // Evento cuando comienza la reproducción. El backend incrementa el playCount
  // al solicitar el stream; aquí refrescamos las estadísticas para mostrar el
  // contador actualizado en UI.
  onPlay(): void {
    const id = this.song?.id?.toString();
    if (!id) return;
    // Pequeño retraso para asegurar que el backend procesó el incremento
    setTimeout(() => {
      this.api.getTrackStats(id).subscribe({
        next: (res) => {
          if (this.song) {
            this.song.playCount = res?.data?.playCount ?? this.song.playCount ?? 0;
          }
        },
        error: (e) => console.warn('No se pudieron refrescar las estadísticas:', e)
      });
    }, 250);
  }

  private resolveArtistName(): void {
    if (!this.song) return;
    if (this.song.artist && this.song.artist !== 'Artista desconocido') return;
    const artistId = this.song.artistId;
    if (!artistId) return;
    // Si el artistId no es numérico, asumimos que backend de usuarios no puede resolverlo todavía
    if (typeof artistId === 'string' && !/^\d+$/.test(artistId)) return; 
    this.artistsService.getArtistById(String(artistId)).subscribe(artist => {
      if (artist && this.song) {
        this.song.artist = artist.name || artist.username || this.song.artist;
      }
    });
  }

  confirmDeleteSong(): void {
    const s = this.song;
    if (!s) return;
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { name: s.title } });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.songService.deleteTrack(String(s.id)).subscribe({
        next: () => {
          this.snack.open('Canción eliminada', undefined, { duration: 2000 });
          history.length > 1 ? history.back() : location.assign('/songs');
        },
        error: (err) => {
          console.error('Error eliminando canción', err);
          this.snack.open('No se pudo eliminar la canción', undefined, { duration: 3000 });
        },
      });
    });
  }
}
