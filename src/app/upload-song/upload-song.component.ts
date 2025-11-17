import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload-song',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})
export class UploadSongComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  form = this.fb.group({
    title: ['', Validators.required],
    albumId: ['', Validators.required],
    trackNumber: [null],
    durationSec: [null],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    await this.api.createTrack({
      title: String(this.form.value.title),
      albumId: String(this.form.value.albumId),
      trackNumber: this.form.value.trackNumber ?? null,
      durationSec: this.form.value.durationSec ?? null
    }).toPromise();
    alert('¡Canción creada!');
    this.form.reset();
  }
}
