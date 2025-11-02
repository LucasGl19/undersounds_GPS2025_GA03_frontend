import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import{NgFor} from '@angular/common';

@Component({
  selector: 'app-songs',
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrl: './songs.component.css'
})
export class SongsComponent {
  songs = [
    { title: 'Canción 1', artist: 'Artista 1', image: 'assets/rectangle.svg'},
    { title: 'Canción 2', artist: 'Artista 2', image: 'assets/rectangle.svg' },
    { title: 'Canción 3', artist: 'Artista 3', image: 'assets/rectangle.svg' }
  ]
}
