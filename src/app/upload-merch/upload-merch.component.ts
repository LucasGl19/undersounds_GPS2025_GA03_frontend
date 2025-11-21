import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MerchService, MerchCreateDto } from '../services/merch.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-merch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './upload-merch.component.html',
  styleUrls: ['./upload-merch.component.css']
})
export class UploadMerchComponent {
  private fb = inject(FormBuilder);
  private merch = inject(MerchService);
  private auth = inject(AuthService);
  private router = inject(Router);

  currentUser: UserProfile | null = null;
  loading = false;
  createdId: string | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: ['camiseta', Validators.required],
    price: [null],
    currency: ['EUR'],
    stock: [null],
    sku: [''],
    labelId: [''],
    coverUrl: [''],
    coverAlt: [''],
  });

  ngOnInit(): void {
    this.auth.me().subscribe({
      next: (profile) => (this.currentUser = profile),
      error: (err) => console.error('[UploadMerch] me() error', err)
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.currentUser?.id) {
      alert('Debes iniciar sesión (no user id).');
      return;
    }

    const v = this.form.value;
    const payload: MerchCreateDto = {
      name: String(v.name).trim(),
      type: v.type as any,
      description: v.description ? String(v.description).trim() || null : null,
      price: v.price != null ? Number(v.price) : null,
      currency: v.currency ? String(v.currency) : 'EUR',
      stock: v.stock != null ? Number(v.stock) : null,
      sku: v.sku ? String(v.sku).trim() || null : null,
      active: true,
      artistId: String(this.currentUser.id),
    };
    if (v.labelId && String(v.labelId).trim()) payload.labelId = String(v.labelId).trim();
    if (v.coverUrl && String(v.coverUrl).trim()) {
      payload.cover = { url: String(v.coverUrl).trim(), alt: v.coverAlt || 'merch' };
    }

    try {
      this.loading = true;
      const resp = await this.merch.createMerch(payload).toPromise();
      const id = resp?.data?.id;
      if (!id) {
        alert('Creado pero sin ID devuelto');
      } else {
        this.createdId = id;
        alert('¡Producto creado!');
        // Navegar al detalle
        this.router.navigate(['/merchandising', id]);
      }
      this.form.reset({ type: 'camiseta', currency: 'EUR' });
    } catch (e: any) {
      console.error('[UploadMerch] error creando merch', e);
      alert(`Error: ${e?.error?.message ?? e?.message ?? 'Error creando'}`);
    } finally {
      this.loading = false;
    }
  }
}
