import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrl: './subheader.component.css'
})
export class SubheaderComponent {
  constructor(private router: Router) {}

  navigateToSongs() { this.router.navigate(['/songs']);}
  navigateToArtists() {this.router.navigate(['/artists'])}
}
