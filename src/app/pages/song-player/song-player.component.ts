import { Component, OnInit } from '@angular/core';
import { SongsService } from '../../services/songs.service';
import { SongCard } from '../../models/song-card.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-player',
  imports: [CommonModule],
  templateUrl: './song-player.component.html',
  styleUrl: './song-player.component.css'
})
export class SongPlayerComponent implements OnInit {
  song: SongCard | undefined;
  isLoading: boolean = true;
  errorMsg: string = '';
  
  constructor(private route: ActivatedRoute, private songService: SongsService){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      // Intentar primero como número (para datos mock)
      const numericId = Number(id);
      if (!isNaN(numericId)) {
        this.song = this.songService.getSongById(numericId);
      }
      
      // Si no se encuentra en local o es un string ID, intentar desde el backend
      if (!this.song) {
        this.loadSongFromBackend(id);
      } else {
        this.isLoading = false;
      }
    } else {
      this.errorMsg = 'ID de canción no válido';
      this.isLoading = false;
    }
  }
  
  private loadSongFromBackend(trackId: string): void {
    this.isLoading = true;
    this.songService.getTrackByIdFromBackend(trackId).subscribe({
      next: (song) => {
        this.song = song;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar la canción desde el backend:', error);
        this.errorMsg = 'No se pudo cargar la canción';
        this.isLoading = false;
      }
    });
  }
}
