import { Component, Input, OnInit } from '@angular/core';
import { ArtistStats, StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-artist-stats',
  imports: [],
  templateUrl: './artist-stats.component.html',
  styleUrl: './artist-stats.component.css',
})
export class ArtistStatsComponent {
  @Input() artistId: string | undefined;
  stats?: ArtistStats;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getArtistStats(`${this.artistId}`).subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Error fetching artist stats', err);
        this.stats = {
          totalSales: 0,
          totalPlays: 0,
        };
      },
    });
  }
}
