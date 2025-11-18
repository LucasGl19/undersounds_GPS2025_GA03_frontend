import { Component, OnInit } from '@angular/core';
import { SongCard } from '../models/song-card.model';
import { Album } from '../models/album.model';
import { AuthService } from '../services/auth.service';
import { AlbumsService } from '../services/albums.service';
import { SongsService } from '../services/songs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SourceMap } from '@angular/compiler';

@Component({
  selector: 'app-modify-creations',
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-creations.component.html',
  styleUrl: './modify-creations.component.css'
})
export class ModifyCreationsComponent implements OnInit {
   artistSongs: SongCard[] = [] ;
   artistAlbums: Album[] = [];
   openedSongId: number | string | null = null;
   openedAlbumId: number | null = null;

   constructor(private authService: AuthService, private albumService:AlbumsService, private songService: SongsService){};
   ngOnInit(): void {
      const artistId = this.authService.getUserId?.();
      if(artistId) {
        this.artistSongs = this.songService.getArtistSongs(artistId);
        this.artistAlbums = this.albumService.getAlbumArtist(artistId);
      }
   }

   toggleSongEditor(id: number | string) {
      this.openedSongId = this.openedSongId == id? null : id;
   }

   toggleAlbumEditor(id: number) {
      this.openedAlbumId = this.openedAlbumId == id ? null : id;
   }

   saveSong(song: SongCard) {
    alert('Canción modifcada!');
   }

    saveAlbum(album: Album) {
    alert('Álbum modifcado!');
   }
}
