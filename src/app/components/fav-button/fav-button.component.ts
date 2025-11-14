import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'app-fav-button',
  imports: [MatIconModule],
  templateUrl: './fav-button.component.html',
  styleUrl: './fav-button.component.css'
})
export class FavButtonComponent {
  @Input() itemId: string = '';

  constructor(private albumsService: AlbumsService) {}

  buttonText: string = 'Agregar a favoritos';

  saveAsFav(){
    if (!this.itemId) return;
    // Lógica para guardar el ítem como favorito (puede ser una llamada a un servicio)
    this.buttonText = '¡Guardado!';
    this.albumsService.saveAlbumAsFavorite(this.itemId);
    setTimeout(() => {
      this.buttonText = 'Agregar a favoritos';
    }, 2000);
  }

}
