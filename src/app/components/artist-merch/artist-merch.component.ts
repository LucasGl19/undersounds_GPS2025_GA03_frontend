import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MerchItem } from '../../models/merch-item.model';
import { MerchService } from '../../services/merch.service';

@Component({
  selector: 'app-artist-merch',
  imports: [CommonModule],
  templateUrl: './artist-merch.component.html',
  styleUrls: ['./artist-merch.component.css'],
})
export class ArtistMerchComponent {
  @Input() artistId!: number | undefined;
  merchItems: MerchItem[] = [];
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(private merchService: MerchService) {}

  ngOnInit() {
    if (!this.artistId) {
      this.errorMsg = 'ID de artista no proporcionado';
      this.isLoading = false;
      return;
    }

    this.merchService.getArtistMerch(this.artistId).subscribe({
      next: (response) => {
        this.merchItems = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching albums for artist', err);
        this.errorMsg = 'No se pudieron cargar los álbumes del artista.';
        this.isLoading = false;
      },
    });
  }
}
