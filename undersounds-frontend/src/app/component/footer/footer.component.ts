import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  constructor(private router: Router) {}

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToHelp() {
    this.router.navigate(['/help']);
  }

  navigateToUseTerms() {
    this.router.navigate(['/terms']);
  }

  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy']);
  }
}
