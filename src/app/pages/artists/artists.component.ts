import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists.service';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css',
})
export class ArtistsComponent implements OnInit, OnDestroy {
  artists: Artist[] = [];
  selectedSort: 'name' | 'createdAt' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';
  isSearching: boolean = false;
  searchError: string | null = null;
  backendArtists: any[] = [];
  private searchSubject = new Subject<string>();
  private reloadSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private artistsService: ArtistsService) {}

  ngOnInit(): void {
    // Búsqueda con debounce -> recarga
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.triggerReload());

    // Canal de recarga: cancela peticiones previas con switchMap
    this.reloadSubject
      .pipe(
        switchMap(() => {
          this.isSearching = true;
          this.searchError = null;
          return this.artistsService
            .searchArtists(this.searchQuery || '', 1, 100, this.selectedSort, this.sortOrder)
            .pipe(
              catchError((error) => {
                console.error('Error cargando artistas:', error);
                this.searchError = this.searchQuery
                  ? 'Error al buscar artistas. Por favor, intenta de nuevo.'
                  : 'Error al cargar artistas. Mostrando datos locales.';
                // Fallback a datos locales
                this.backendArtists = [];
                this.artists = this.artistsService.getArtists();
                this.isSearching = false;
                return of(null);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        if (response) {
          this.backendArtists = response.items;
        }
        this.isSearching = false;
      });

    // Carga inicial
    this.triggerReload();
  }
  
  loadArtistsFromBackend(): void {
    this.triggerReload();
  }
  
  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }
  
  performSearch(query: string): void {
    // Cualquier cambio en query dispara una recarga por el pipeline
    this.triggerReload();
  }
  
  sortBy(criteria: 'name' | 'createdAt') {
    if (this.isSearching) return;

    if(this.selectedSort === criteria) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.selectedSort = criteria;
      this.sortOrder = 'asc';
    }
    this.triggerReload();
  }

  private triggerReload() {
    this.reloadSubject.next();
  }

}
