import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongCard } from '../../models/song-card.model';
import { SongsService } from '../../services/songs.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
})
export class SongsComponent implements OnInit {
  songs: SongCard[] = [];
  searchQuery: string = '';
  selectedSort: 'title' | 'durationSec' | 'createdAt' | null = null;
  constructor(private songService: SongsService, private router: Router) {}

  navigateToSongPlayer(id: number) {
    this.router.navigate(['song-player', id]);
  }

  ngOnInit(): void {
    this.songs = this.songService.getSongs();
  }

  searchSongs(query?: string) {
    const term = query?.toLowerCase() || this.searchQuery.toLowerCase(); // no se usa
    this.songs = this.songService.getSongs();
  }

  sortBy(criteria: 'title' | 'durationSec' | 'createdAt') {
  if (this.selectedSort === criteria) {
    this.selectedSort = null;
    this.songs = this.songService.getSongs(); 
    return;
  }

  this.selectedSort = criteria;

  this.songs = [...this.songs].sort((a, b) => {
    if (criteria === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (criteria === 'durationSec') {
      return (a.durationSec ?? 0) - (b.durationSec ?? 0);
    }
    if (criteria === 'createdAt') {
      return new Date(a.createdAt ?? 0).getTime() -
             new Date(b.createdAt ?? 0).getTime();
    }
    return 0;
  });
}

}

