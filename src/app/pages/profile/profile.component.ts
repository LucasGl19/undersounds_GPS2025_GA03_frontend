import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly user = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.authService
      .me()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (profile) => {
          this.user.set(profile);
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
}
