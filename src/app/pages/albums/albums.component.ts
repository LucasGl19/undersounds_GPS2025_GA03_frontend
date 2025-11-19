import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Album } from '../../models/album.model';
import { AlbumsService } from '../../services/albums.service';
import { FormsModule } from '@angular/forms';
import { AlbumFilters } from '../../services/api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  isLoading: boolean = false;
  useBackend: boolean = true;
  dataSource: 'backend' | 'mock' = 'backend'; // Indica la fuente de datos actual
  errorMsg: string = '';
  showDebugInfo: boolean = environment.showDebugInfo;
  
  // Filtros
  searchQuery: string = '';
  selectedGenre: string = '';
  selectedTag: string = '';
  selectedReleaseState: string = '';

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  // Listas para los selects
  availableGenres: string[] = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Hip Hop', 'Classical', 'Folk', 'Metal', 'Reggae', 'Blues', 'Ambient', 'Synthwave', 'Lofi', 'Shoegaze', 'House'];
  availableTags: string[] = ['indie', 'experimental', 'acoustic', 'live', 'remix', 'instrumental', 'lo-fi', 'ambient', 'chill'];
  availableReleaseStates: string[] = ['draft', 'scheduled', 'published', 'archived'];

  constructor(private albumsService: AlbumsService, private router: Router) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  navigateToAlbumDetail(id: string | number) {
    this.router.navigate(['album', id]);
  }

  loadAlbums() {
    if (this.useBackend) {
      this.loadFromBackend();
    } else {
      this.loadFromMock();
    }
  }

  loadFromBackend() {
    this.isLoading = true;
    this.errorMsg = '';
    const filters: AlbumFilters = this.buildFilters();
    if (this.showDebugInfo) {
      console.log('🔎 Filtros enviados al BACKEND:', filters);
    }

    this.albumsService.getAlbumsFromBackend(filters).subscribe({
      next: (response) => {
        if (this.showDebugInfo) {
          console.log('✅ Datos cargados desde el BACKEND:', response);
          console.log('📊 Total de álbumes recibidos:', response.albums.length);
        }
        this.albums = response.albums;
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
        this.errorMsg = `No se pudieron cargar los álbumes (HTTP ${status}). ${msg}`;
        this.isLoading = false;
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
    this.isLoading = false;
    let filteredAlbums = this.albumsService.getAlbums();

    // Aplicar filtros localmente
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filteredAlbums = filteredAlbums.filter(album => 
        album.title.toLowerCase().includes(query) ||
        album.description.toLowerCase().includes(query)
      );
    }

    if (this.selectedGenre) {
      filteredAlbums = filteredAlbums.filter(album => 
        album.genres?.includes(this.selectedGenre)
      );
    }

    if (this.selectedReleaseState) {
      filteredAlbums = filteredAlbums.filter(album => album.releaseState === this.selectedReleaseState);
    }

    this.albums = filteredAlbums;
  }

  buildFilters(): AlbumFilters {
    const filters: AlbumFilters = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.searchQuery) filters.q = this.searchQuery;
    if (this.selectedGenre) filters.genre = this.selectedGenre;
    if (this.selectedTag) filters.tag = this.selectedTag;
    if (this.selectedReleaseState) filters.releaseState = this.selectedReleaseState;

    return filters;
  }

  searchAlbums() {
    this.currentPage = 1; // Reset a la primera página al buscar
    this.loadAlbums();
  }

  applyFilters() {
    this.currentPage = 1; // Reset a la primera página al filtrar
    this.loadAlbums();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedGenre = '';
    this.selectedTag = '';
    this.selectedReleaseState = '';
    this.currentPage = 1;
    this.loadAlbums();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadAlbums();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadAlbums();
    }
  }
}
