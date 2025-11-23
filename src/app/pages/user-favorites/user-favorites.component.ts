import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-favorites',
  imports: [CommonModule],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.css'
})
export class UserFavoritesComponent implements OnInit {
  
  userId: string | null = null;
  favMerch: any[] = [];

  constructor(private auth: AuthService, private favService: FavoritesService){};
  ngOnInit(): void {
    this.userId = this.auth.getUserId();
    if(this.userId) {
      this.favService.getFavorites(this.userId).subscribe({
        next:(res: any) => this.favMerch = res.data ?? [],
        error: err => console.error('Error al cargar favoritos', err)
      });
    }
  }
}
