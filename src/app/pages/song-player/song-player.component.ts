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
  constructor(private route: ActivatedRoute, private songService: SongsService){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.song = this.songService.getSongById(id);
  }
}
