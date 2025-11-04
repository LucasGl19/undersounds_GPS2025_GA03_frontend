import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-to-top-button',
  imports: [CommonModule],
  templateUrl: './back-to-top-button.component.html',
  styleUrl: './back-to-top-button.component.css',
})
export class BackToTopButtonComponent {
  isVisible: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isVisible = yOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
