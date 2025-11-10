import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongCard } from '../../models/song-card.model';
import { SongsService } from '../../services/songs.service';

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
})
export class SongsComponent implements OnInit {
  songs: SongCard[] = [];
  constructor(private songService: SongsService, private router: Router) {}

  navigateToSongPlayer(id: number) {
    this.router.navigate(['song-player', id]);
  }

  ngOnInit(): void {
    this.songs = this.songService.getSongs();
  }
}

