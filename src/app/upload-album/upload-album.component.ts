import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, AlbumCreateDto, TrackMinimal } from '../services/api.service';

@Component({
  selector: 'app-upload-album',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.css']
})
export class UploadAlbumComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    date: [''],
    price: [null],
    currency: ['EUR'],
    genre: ['other'],     // select de un valor → lo convertimos a array
    tags: [''],           // CSV → lo convertimos a array
    thumbnail: [''],      // de momento NO se envía
    artistId: ['', Validators.required],
    labelId: ['', Validators.required],
    songs: this.fb.array([]) // sin required
  });

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

    const v = this.form.value;
    const payload: AlbumCreateDto = {
      title: String(v.title),
      description: v.description || null,
      releaseDate: v.date || null,       // YYYY-MM-DD
      price: v.price ?? null,
      currency: v.currency || null,
      genres: v.genre ? [String(v.genre)] : [],
      tags: v.tags ? String(v.tags).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      artistId: String(v.artistId),
      labelId: String(v.labelId),
      // coverUrl: v.thumbnail || '' // ← NO lo enviamos por ahora
    };

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
