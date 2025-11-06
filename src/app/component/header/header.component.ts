import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  role: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getUserRole();
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToCart() {
    this.router.navigate(['/cart']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToUploadSong() {
    this.router.navigate(['/upload-song']);
  }

  navigateToUploadAlbum() {
    this.router.navigate(['/upload-album']);
  }
}
