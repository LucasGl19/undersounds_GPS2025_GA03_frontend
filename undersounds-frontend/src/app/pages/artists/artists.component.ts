import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent {
  artists = [
    { name: 'Artista 1', genre: 'Pop', image: 'assets/usuario.png' },
    { name: 'Artista 2', genre: 'Rock', image: 'assets/usuario.png' },
    { name: 'Artista 3', genre: 'Rap', image: 'assets/usuario.png' },
  ]
}
