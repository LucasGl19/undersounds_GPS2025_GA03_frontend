import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistsService } from '../../services/artists.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css',
})
export class ArtistsComponent implements OnInit {
  artists: Artist[] = [];
  selectedSort: 'name' | 'createdAt' | null = null;
  selectedGenre: string | null = null;
  selectedCountry: string | null = null;
  genres: string[] = [];
  countries: string[] = [];
  showFilters = false;

  constructor(private artistsService: ArtistsService) {}

  ngOnInit(): void {
    this.artists = this.artistsService.getArtists();

    this.genres = Array.from(new Set(this.artists.map(a => a.genre))).sort();
    this.countries = Array.from(new Set(this.artists.map(a => a.nationality))).sort();
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
