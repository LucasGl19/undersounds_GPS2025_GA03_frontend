import { Component } from '@angular/core';


@Component({
  selector: 'app-upload-album',
  standalone: true,
  imports: [],
  templateUrl: './upload-album.component.html',
  styleUrls: ['./upload-album.component.css']
})
export class UploadAlbumComponent {
  songs: string[] = [];

    uploadAlbumMessage() {
      alert('¡Álbum subido con éxito!');
    }
    addSong() {
      const inputs = document.querySelectorAll<HTMLInputElement>('.song-input');
      const lastInput = inputs[inputs.length - 1];
      const songName = lastInput.value.trim();

      if (songName !== '') {
        this.songs.push(songName);

        const songList = document.getElementById('songList');
        const li = document.createElement('li');
        li.textContent = songName;
        songList?.appendChild(li);

        lastInput.disabled = true;

        const songInputsContainer = document.getElementById('songInputsContainer');
        const newField = document.createElement('div');
        newField.className = 'form-field';
        newField.innerHTML = `<input type="text" placeholder="Ej: Añade otra canción" class="song-input"/>`;
        songInputsContainer?.appendChild(newField);
      }
    }

    removeLastSongInput() {
      const songInputsContainer = document.getElementById('songInputsContainer');
      const fields = songInputsContainer?.querySelectorAll('.form-field');

      if(fields && fields.length > 0) {
        if(fields.length === 1) {
            const input = fields[0].querySelector('input');
            if(input) {
              input.value = '';
              input.disabled = false;
            }
        }
        else {
        const lastField = fields[fields.length - 1];
        songInputsContainer?.removeChild(lastField);
        }
      }
    }
}
