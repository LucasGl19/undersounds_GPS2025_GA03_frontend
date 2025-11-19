import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { AlbumsService } from '../services/albums.service';
import { Album } from '../models/album.model';

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

  currentUser: UserProfile | null = null;
  userAlbums: Album[] = [];
  loading = false;
  createdTrackId: string | null = null;
  uploadingAudio = false;

  form = this.fb.group({
    title: ['', Validators.required],
    albumId: ['', Validators.required],
    trackNumber: [null],
    durationSec: [null],
  });

  audioForm = this.fb.group({
    audioFile: [null as any, Validators.required],
    bitrate: ['128'],
    codec: ['mp3'],
  });

  ngOnInit(): void {
    this.loadUserAlbums();
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

  async submit(): Promise<void> {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }

    if (!this.currentUser) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    try {
      const response = await this.api.createTrack({
        title: String(this.form.value.title).trim(),
        albumId: String(this.form.value.albumId).trim(),
        trackNumber: this.form.value.trackNumber ? Number(this.form.value.trackNumber) : null,
        durationSec: this.form.value.durationSec ? Number(this.form.value.durationSec) : null
      }).toPromise();
      
      // Guardar el ID de la canción creada
      if (response && response.data && response.data.id) {
        this.createdTrackId = response.data.id;
        console.log('[UploadSongComponent] Track created with ID:', this.createdTrackId);
      }
      
      alert('¡Canción creada correctamente! Ahora puedes subir el archivo de audio.');
    } catch (error: any) {
      console.error('[UploadSongComponent] Error creating track:', error);
      alert(`Error al crear la canción: ${error?.error?.message ?? error?.message ?? 'Error'}`);
    }
  }

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.audioForm.patchValue({ audioFile: file });
      console.log('[UploadSongComponent] Audio file selected:', file.name);
    }
  }

  async submitAudio(): Promise<void> {
    if (!this.audioForm.value.audioFile || !this.createdTrackId) {
      alert('Por favor selecciona un archivo de audio.');
      return;
    }

    const audioFile = this.audioForm.value.audioFile as File;
    const bitrate = this.audioForm.value.bitrate || '128';
    const codec = this.audioForm.value.codec || 'mp3';

    try {
      this.uploadingAudio = true;
      console.log('[UploadSongComponent] Uploading audio for track:', this.createdTrackId);
      
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('bitrate', String(bitrate));
      formData.append('codec', String(codec));

      // Llamar directamente al endpoint usando HttpClient
      await this.api.uploadTrackAudio(this.createdTrackId, formData).toPromise();
      
      alert('¡Archivo de audio subido correctamente!');
      this.createdTrackId = null;
      this.audioForm.reset();
      this.form.reset();
      this.uploadingAudio = false;
    } catch (error: any) {
      console.error('[UploadSongComponent] Error uploading audio:', error);
      alert(`Error al subir el audio: ${error?.error?.message ?? error?.message ?? 'Error'}`);
      this.uploadingAudio = false;
    }
  }
}
