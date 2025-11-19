import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile, UserUpdateDto } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtistStatsComponent } from '../../components/artist-stats/artist-stats.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, ArtistStatsComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly user = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly isEditing = signal(false);
  readonly saving = signal(false);
  readonly previewUrl = signal<string | null>(null);

  profileForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService
      .me()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.user.set(profile);
          this.initForm(profile);
          this.loading.set(false);
        },
        error: (err) => {
          if (err.status === 401) {
            this.error.set('Inicia sesión para ver tu perfil.');
          } else {
            this.error.set('No se pudo cargar el perfil.');
          }
          this.loading.set(false);
        },
      });
  }

  private initForm(profile: UserProfile): void {
    this.profileForm = this.fb.group({
      username: [profile.username || '', [Validators.required, Validators.minLength(3)]],
      bio: [profile.bio || '', [Validators.maxLength(500)]],
      avatarUrl: [profile.avatarUrl || '']
    });
    this.previewUrl.set(null);
    this.selectedFile = null;
  }

  onEdit(): void {
    this.isEditing.set(true);
  }

  onCancel(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.initForm(currentUser);
    }
    this.isEditing.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.error.set('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.error.set('La imagen no debe superar los 2MB');
        return;
      }
      
      this.selectedFile = file;
      this.error.set(null);
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.previewUrl.set(result);
        this.profileForm.patchValue({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl.set(null);
    this.profileForm.patchValue({ avatarUrl: '' });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const updateData: UserUpdateDto = {
      username: this.profileForm.value.username || undefined,
      bio: this.profileForm.value.bio || undefined,
      avatarUrl: this.profileForm.value.avatarUrl || undefined
    };
    
    // Eliminar avatarUrl si está vacío
    if (!updateData.avatarUrl) {
      delete updateData.avatarUrl;
    }

    this.authService
      .updateProfile(updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedProfile) => {
          this.user.set(updatedProfile);
          this.isEditing.set(false);
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set('No se pudo actualizar el perfil.');
          this.saving.set(false);
        },
      });
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: 'tu cuenta' },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.deleteAccount().subscribe({
          next: () => {
            this.authService.clearTokens();
            this.router.navigate(['/login']);
          },
          error: () => {
            this.error.set('No se pudo eliminar la cuenta.');
          },
        });
      }
    });
  }
}
