// user-recommendations.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { RecommendationsService, Album } from '../../services/recommendations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-recommendations',
  imports: [CommonModule],
  templateUrl: './user-recommendations.component.html',
  styleUrls: ['./user-recommendations.component.css']
})
export class UserRecommendationsComponent implements OnInit {
  @Input() userId!: string; // recibimos el ID del usuario desde el perfil
  recommendations: Album[] = [];
  loading = true;
  error: string | null = null;

  constructor(private recommendationsService: RecommendationsService) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.error = 'No se proporcionó ID de usuario.';
      this.loading = false;
      return;
    }

    this.recommendationsService.getRecommendationsForUser(this.userId)
      .subscribe({
        next: (albums) => {
          this.recommendations = albums;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando recomendaciones', err);
          this.error = 'No se pudieron cargar las recomendaciones.';
          this.loading = false;
        }
      });
  }
}
