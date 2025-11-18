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
      // Si es un número, buscar en mock
      const numericId = Number(id);
      if (!isNaN(numericId) && numericId > 0 && numericId < 1000) {
        this.song = this.songService.getSongById(numericId);
        if (this.song) {
          console.log('🎵 Canción encontrada en mock:', this.song);
          this.isLoading = false;
          return;
        }
      }
      
      // Si no es un número o no se encontró en mock, cargar desde backend
      console.log('🌐 Cargando canción desde backend, ID:', id);
      this.loadSongFromBackend(id);
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
