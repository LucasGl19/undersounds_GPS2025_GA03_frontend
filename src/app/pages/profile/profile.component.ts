import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService
      .me()
      .pipe(takeUntilDestroyed(this.destroyRef))
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

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: 'tu cuenta' },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí va tu lógica de borrado (dummy o real)
        console.log('Cuenta eliminada');
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }
}
