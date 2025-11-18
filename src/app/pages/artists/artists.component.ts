import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css',
})
export class ArtistsComponent implements OnInit, OnDestroy {
  artists: Artist[] = [];
  selectedSort: 'name' | 'createdAt' | null = null;
  selectedGenre: string | null = null;
  selectedCountry: string | null = null;
  genres: string[] = [];
  countries: string[] = [];
  showFilters = false;
  searchQuery: string = '';
  isSearching: boolean = false;
  searchError: string | null = null;
  backendArtists: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(private artistsService: ArtistsService) {}

  ngOnInit(): void {
    // Cargar artistas del backend al iniciar
    this.loadArtistsFromBackend();
    
    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.performSearch(query);
    });
  }
  
  loadArtistsFromBackend(): void {
    this.isSearching = true;
    this.artistsService.searchArtists('', 1, 100).subscribe({
      next: (response) => {
        this.backendArtists = response.items;
        this.isSearching = false;
        
        // Extraer géneros y países de los artistas del backend
        // Nota: Como el backend no devuelve género/nacionalidad, los filtros se deshabilitarán
        this.genres = [];
        this.countries = [];
      },
      error: (error) => {
        console.error('Error cargando artistas:', error);
        this.searchError = 'Error al cargar artistas. Mostrando datos locales.';
        this.isSearching = false;
        // Fallback a datos locales si el backend no está disponible
        this.artists = this.artistsService.getArtists();
        this.genres = Array.from(new Set(this.artists.map(a => a.genre))).sort();
        this.countries = Array.from(new Set(this.artists.map(a => a.nationality))).sort();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
  
  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }
  
  performSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      // Si no hay búsqueda, recargar todos los artistas
      this.loadArtistsFromBackend();
      this.searchError = null;
      return;
    }
    
    this.isSearching = true;
    this.searchError = null;
    
    this.artistsService.searchArtists(query).subscribe({
      next: (response) => {
        this.backendArtists = response.items;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error buscando artistas:', error);
        this.searchError = 'Error al buscar artistas. Por favor, intenta de nuevo.';
        this.isSearching = false;
        this.backendArtists = [];
      }
    });
  }
  
  filterByGenre(): void {
    const allArtists = this.artistsService.getArtists();

    if (!this.selectedGenre) {
      this.artists = allArtists;
      return;
    }
    this.artists = allArtists.filter(a => a.genre === this.selectedGenre);
  }

  filterByCountry(): void {
    const allArtists = this.artistsService.getArtists();
    if (!this.selectedCountry) {
      this.artists = allArtists;
      return;
    }
    this.artists = allArtists.filter(a => a.nationality === this.selectedCountry)
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    const allArtists = this.artistsService.getArtists();
    this.artists = allArtists.filter(a =>
      (!this.selectedGenre || a.genre === this.selectedGenre) &&
      (!this.selectedCountry || a.nationality === this.selectedCountry)
    );
  }
  
  sortBy(criteria: 'name' | 'createdAt' | null) {
    if(this.selectedSort === criteria) {
      this.selectedSort = null;
      this.artists = this.artistsService.getArtists();
      return;
    }

    this.selectedSort = criteria;

    this.artists = [...this.artists].sort((a, b) => {
      if(criteria === 'name') {
        return a.name.localeCompare(b.name);
      }
      if(criteria === 'createdAt') {
        return a.createdAt.localeCompare(b.createdAt);
      }
      return 0;
    });
  }

}
