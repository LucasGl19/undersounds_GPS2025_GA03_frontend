import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, AlbumCreateDto, TrackMinimal } from '../services/api.service';
import { AuthService, UserProfile } from '../services/auth.service';

@Component({
  selector: 'app-upload-album',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.css']
})
export class UploadAlbumComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private auth = inject(AuthService);

  currentUser: UserProfile | null = null;

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: [''],
    price: [null],
    currency: ['EUR'],
    genre: ['other'],     // select de un valor → lo convertimos a array
    tags: [''],           // CSV → lo convertimos a array
    thumbnail: [''],      // de momento NO se envía
    labelId: [''],        // opcional
    songs: this.fb.array([]) // sin required
  });

  ngOnInit(): void {
    // Obtener el perfil del usuario autenticado
    this.auth.me().subscribe({
      next: (profile) => {
        this.currentUser = profile;
        console.log('[UploadAlbumComponent] User profile loaded:', profile);
      },
      error: (err) => {
        console.error('[UploadAlbumComponent] Error loading profile:', err);
      }
    });
  }

  get songsArray(): FormArray { return this.form.get('songs') as FormArray; }
  addSong() { this.songsArray.push(this.fb.control('')); }
  removeLastSongInput() {
    if (this.songsArray.length > 1) this.songsArray.removeAt(this.songsArray.length - 1);
    else if (this.songsArray.length === 1) this.songsArray.clear();
  }

  async uploadAlbum(): Promise<void> {
    console.log('[uploadAlbum] submit click');
    if (this.form.invalid) {
      console.warn('[uploadAlbum] form invalid', this.form.value);
      this.form.markAllAsTouched();
      return;
    }

    // Obtener el ID del usuario autenticado
    if (!this.currentUser || !this.currentUser.id) {
      alert('No estás autenticado. Por favor inicia sesión.');
      return;
    }

    const userId = String(this.currentUser.id).trim();
    if (!userId) {
      alert('Error: ID de usuario vacío. Por favor inicia sesión nuevamente.');
      return;
    }
    console.log('[uploadAlbum] userId:', userId, 'type:', typeof userId);

    const v = this.form.value;
    const payload: AlbumCreateDto = {
      title: String(v.title).trim(),
      description: v.description ? String(v.description).trim() || null : null,
      releaseDate: v.date ? String(v.date).trim() || null : null,
      price: v.price ? Number(v.price) : null,
      currency: v.currency ? String(v.currency).trim() : null,
      genres: v.genre ? [String(v.genre).trim()].filter(Boolean) : [],
      tags: v.tags ? String(v.tags).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      artistId: userId,  // Asegurado como string
    };

    // Solo agregar labelId si tiene valor
    if (v.labelId && String(v.labelId).trim()) {
      (payload as any).labelId = String(v.labelId).trim();
    }

    console.log('[uploadAlbum] payload:', payload);

    try {
      const albumResp = await this.api.createAlbum(payload).toPromise();
      console.log('[uploadAlbum] albumResp', albumResp);
      const albumId = albumResp?.data?.id;
      if (!albumId) { alert('No llegó el id del álbum'); return; }

      // Construimos tracks sólo si hay títulos
      const tracks: TrackMinimal[] = this.songsArray.controls
        .map(c => String(c.value).trim())
        .filter(Boolean)
        .map((title, i) => ({ title, trackNumber: i + 1 }));

      if (tracks.length) {
        await this.api.addTracksToAlbum(albumId, tracks).toPromise();
      }

      alert('¡Álbum creado correctamente!');
      this.form.reset({ currency: 'EUR', genre: 'other' });
      this.songsArray.clear();
    } catch (e: any) {
      console.error('[uploadAlbum] error', e);
      alert(`Error creando álbum: ${e?.error?.message ?? e?.message ?? 'Error'}`);
    }
  }
}
