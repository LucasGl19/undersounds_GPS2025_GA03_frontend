import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongCard } from '../../models/song-card.model';
import { SongsService } from '../../services/songs.service';
import { FormsModule } from '@angular/forms';
import { TrackFilters } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
})
export class SongsComponent implements OnInit {
  songs: SongCard[] = [];
  isLoading: boolean = false;
    useBackend: boolean = true;
    dataSource: 'backend' | 'mock' = 'backend'; // Indica la fuente de datos actual
  errorMsg: string = '';
  showDebugInfo: boolean = environment.showDebugInfo;
  
  // Filtros
  searchQuery: string = '';
  selectedGenre: string = '';
  selectedTag: string = '';
  selectedLanguage: string = '';
  releasedFrom: string = '';
  releasedTo: string = '';
  selectedSort: 'title' | 'durationSec' | 'playCount' | null = null;
  selectedOrder: 'asc' | 'desc' = 'asc';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  // Listas para los selects
  availableGenres: string[] = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'Classical', 'Folk', 'Metal', 'Reggae', 'Blues', 'Ambient', 'Synthwave', 'Lofi', 'Shoegaze', 'House'];
  availableTags: string[] = ['indie', 'experimental', 'acoustic', 'live', 'remix', 'instrumental', 'lo-fi', 'ambient', 'chill'];
  availableLanguages: string[] = ['es', 'en', 'fr', 'de', 'it', 'pt', 'instrumental'];

  constructor(private songService: SongsService, private router: Router) {}

  navigateToSongPlayer(id: number) {
    this.router.navigate(['song-player', id]);
  }

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs() {
    if (this.useBackend) {
      this.loadFromBackend();
    } else {
      this.loadFromMock();
    }
  }

  loadFromBackend() {
    this.isLoading = true;
    this.errorMsg = '';
    const filters: TrackFilters = this.buildFilters();
    if (this.showDebugInfo) {
      console.log('🔎 Filtros enviados al BACKEND:', filters);
    }

    this.songService.getTracksFromBackend(filters).subscribe({
      next: (response) => {
        if (this.showDebugInfo) {
          console.log('✅ Datos cargados desde el BACKEND:', response);
        }
        this.songs = response.tracks;
        this.totalPages = response.pagination.totalPages;
          this.dataSource = 'backend';
        this.isLoading = false;
      },
      error: (error) => {
        if (this.showDebugInfo) {
          console.error('❌ Error al conectar con backend:', error);
        }
        const status = error?.status ?? 'desconocido';
        const msg = error?.message || error?.statusText || 'Error desconocido';
        this.errorMsg = `No se pudieron cargar las canciones (HTTP ${status}). ${msg}`;
        this.isLoading = false;
        // Mantener el backend activo para reintentar, no hacer fallback automático
        this.useBackend = true;
        this.dataSource = 'backend';
      }
    });
  }

  loadFromMock() {
    if (this.showDebugInfo) {
      console.log('📦 Usando datos de PRUEBA (mock)');
    }
    this.dataSource = 'mock';
    let filteredSongs = this.songService.getSongs();

    // Aplicar filtros localmente
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredSongs = filteredSongs.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.description.toLowerCase().includes(query)
      );
    }

    if (this.selectedGenre) {
      filteredSongs = filteredSongs.filter(song => song.genre === this.selectedGenre);
    }

    if (this.selectedLanguage) {
      filteredSongs = filteredSongs.filter(song => song.language === this.selectedLanguage);
    }

    // Aplicar ordenación
    if (this.selectedSort) {
      filteredSongs = this.sortSongs(filteredSongs, this.selectedSort, this.selectedOrder);
    }

    this.songs = filteredSongs;
  }

  buildFilters(): TrackFilters {
    const filters: TrackFilters = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.searchQuery) filters.q = this.searchQuery;
    if (this.selectedGenre) filters.genre = this.selectedGenre;
    if (this.selectedTag) filters.tag = this.selectedTag;
    if (this.selectedLanguage) filters.language = this.selectedLanguage;
    if (this.releasedFrom) filters.releasedFrom = this.releasedFrom;
    if (this.releasedTo) filters.releasedTo = this.releasedTo;
    if (this.selectedSort) {
      filters.sort = this.selectedSort;
      filters.order = this.selectedOrder;
    }

    return filters;
  }

  sortSongs(songs: SongCard[], criteria: 'title' | 'durationSec' | 'playCount', order: 'asc' | 'desc'): SongCard[] {
    return [...songs].sort((a, b) => {
      let comparison = 0;

      if (criteria === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (criteria === 'durationSec') {
        comparison = (a.durationSec ?? 0) - (b.durationSec ?? 0);
      } else if (criteria === 'playCount') {
        comparison = (a.playCount ?? 0) - (b.playCount ?? 0);
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  searchSongs() {
    this.currentPage = 1; // Reset a la primera página al buscar
    this.loadSongs();
  }

  applyFilters() {
    this.currentPage = 1; // Reset a la primera página al filtrar
    this.loadSongs();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedTag = '';
    this.selectedLanguage = '';
    this.releasedFrom = '';
    this.releasedTo = '';
    this.selectedSort = null;
    this.selectedOrder = 'asc';
    this.currentPage = 1;
    this.loadSongs();
  }

  sortBy(criteria: 'title' | 'durationSec' | 'playCount') {
    if (this.selectedSort === criteria) {
      // Toggle order
      this.selectedOrder = this.selectedOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.selectedSort = criteria;
      this.selectedOrder = 'asc';
    }
    this.loadSongs();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadSongs();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadSongs();
    }
  }
}

