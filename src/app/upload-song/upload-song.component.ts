import { Component, inject, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { AlbumsService } from '../services/albums.service';
import { Album } from '../models/album.model';
import { SongsService } from '../services/songs.service';

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})
export class UploadSongComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private albumsService = inject(AlbumsService);
  private songsService = inject(SongsService);
  private ngZone = inject(NgZone);

  currentUser: UserProfile | null = null;
  userAlbums: Album[] = [];
  loading = false;
  uploading = false;
  
  // Used for validation of track number
  currentAlbumTracks: any[] = [];

  form = this.fb.group({
    title: ['', Validators.required],
    albumId: ['', Validators.required],
    trackNumber: [null as number | null, [Validators.required, Validators.min(1)]],
    durationSec: [null as number | null, [Validators.required, Validators.min(1)]],
    audioFile: [null as File | null, Validators.required],
    bitrate: ['128'],
    codec: ['mp3'],
  });

  ngOnInit(): void {
    this.loadUserAlbums();
    
    // Listen to album changes to calculate track number
    this.form.get('albumId')?.valueChanges.subscribe(albumId => {
      if (albumId) {
        this.calculateNextTrackNumber(String(albumId));
      }
    });
  }

  private loadUserAlbums(): void {
    this.loading = true;
    // Obtener el perfil del usuario autenticado
    this.auth.me().subscribe({
      next: (profile) => {
        this.currentUser = profile;
        console.log('[UploadSongComponent] User profile loaded:', profile);
        
        // Obtener los álbumes del artista desde el backend
        if (profile && profile.id) {
          this.albumsService.getAlbumArtistFromBackend(profile.id).subscribe({
            next: (albums) => {
              this.userAlbums = albums;
              console.log('[UploadSongComponent] User albums from backend:', this.userAlbums);
              this.loading = false;
            },
            error: (err) => {
              console.error('[UploadSongComponent] Error loading albums from backend:', err);
              // Fallback a datos locales si falla el backend
              this.userAlbums = profile.id ? this.albumsService.getAlbumArtist(profile.id) : [];
              this.loading = false;
            }
          });
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('[UploadSongComponent] Error loading profile:', err);
        this.loading = false;
      }
    });
  }

  private calculateNextTrackNumber(albumId: string): void {
    // Fetch tracks for the selected album
    this.songsService.getTracksFromBackend({ albumId: albumId, limit: 100 }).subscribe({
      next: (response) => {
        this.currentAlbumTracks = response.tracks;
        
        // Find max track number
        let maxTrackNum = 0;
        if (this.currentAlbumTracks && this.currentAlbumTracks.length > 0) {
          this.currentAlbumTracks.forEach(t => {
            if (t.trackNumber && t.trackNumber > maxTrackNum) {
              maxTrackNum = t.trackNumber;
            }
          });
        }
        
        // Set next track number
        const nextNum = maxTrackNum + 1;
        this.form.patchValue({ trackNumber: nextNum });
      },
      error: (err) => console.error('Error fetching album tracks:', err)
    });
  }

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ audioFile: file });
      
      // Calculate duration
      const objectUrl = URL.createObjectURL(file);
      const audio = new Audio();
      
      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        console.log('[UploadSongComponent] Detected duration:', duration);
        
        this.ngZone.run(() => {
          if (isFinite(duration) && !isNaN(duration)) {
            // Use floor to match typical file explorer behavior (truncation)
            this.form.patchValue({ durationSec: Math.floor(duration) });
          }
        });
        
        URL.revokeObjectURL(objectUrl);
      };

      audio.onerror = (err) => {
        console.error('[UploadSongComponent] Error loading audio metadata:', err);
        URL.revokeObjectURL(objectUrl);
      };

      audio.src = objectUrl;
    }
  }

  get formattedDuration(): string {
    const sec = this.form.value.durationSec;
    if (sec === null || sec === undefined) return '';
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }

    // Validate track number uniqueness manually
    const trackNum = this.form.value.trackNumber;
    const exists = this.currentAlbumTracks.some(t => t.trackNumber === trackNum);
    if (exists) {
      alert(`El número de pista ${trackNum} ya existe en este álbum. Por favor elige otro.`);
      return;
    }

    if (!this.currentUser) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      this.uploading = true;
      
      const formData = new FormData();
      formData.append('title', String(this.form.value.title).trim());
      formData.append('albumId', String(this.form.value.albumId).trim());
      if (this.form.value.trackNumber) formData.append('trackNumber', String(this.form.value.trackNumber));
      if (this.form.value.durationSec) formData.append('durationSec', String(this.form.value.durationSec));
      
      // Audio file
      const file = this.form.value.audioFile;
      if (file) {
        formData.append('file', file);
        formData.append('bitrate', String(this.form.value.bitrate || '128'));
        formData.append('codec', String(this.form.value.codec || 'mp3'));
      }

      await this.api.createTrackWithAudio(formData).toPromise();
      
      alert('¡Canción creada y subida correctamente!');
      this.form.reset({ bitrate: '128', codec: 'mp3' });
      this.currentAlbumTracks = [];
      this.uploading = false;
      
    } catch (error: any) {
      console.error('[UploadSongComponent] Error creating track:', error);
      alert(`Error al crear la canción: ${error?.error?.message ?? error?.message ?? 'Error'}`);
      this.uploading = false;
    }
  }
}
