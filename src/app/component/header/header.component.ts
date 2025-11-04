import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
  navigateToCart() {
    this.router.navigate(['/cart']);
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
