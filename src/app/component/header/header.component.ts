import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShareButtonComponent } from '../../components/share-button/share-button.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIconModule, ShareButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
    });
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
}
