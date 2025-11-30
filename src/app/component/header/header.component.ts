import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string | null>;

  constructor(private router: Router, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userRole$ = this.authService.userRole$;
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.clearTokens();
    this.router.navigate(['/']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToUserDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  navigateToModifyMerch() {
    this.router.navigate(['/modify-merch']);
  }

  navigateToModifySection() {
    this.router.navigate(['/modify-creations']);
  }

  navigateToUploadSong() {
    this.router.navigate(['/upload-song']);
  }

  navigateToUploadAlbum() {
    this.router.navigate(['/upload-album']);
  }
}
