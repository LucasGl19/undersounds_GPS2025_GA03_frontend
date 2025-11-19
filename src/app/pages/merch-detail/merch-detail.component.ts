import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchItem } from '../merchandising/merchandising.component';
import { MerchService } from '../../services/merch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merch-detail',
  templateUrl: './merch-detail.component.html',
  imports: [CommonModule],
  styleUrls: ['./merch-detail.component.css'],
})
export class MerchDetailComponent implements OnInit {
  merch: MerchItem | null = null;
  isLoading: boolean = false;
  errorMsg: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private merchService: MerchService
  ) {}

  ngOnInit(): void {
    const merchId = this.route.snapshot.paramMap.get('id');
    if (!merchId) {
      this.errorMsg = 'No se especificó un artículo de merchandising';
      return;
    }
    this.loadMerchItem(merchId);
  }

  loadMerchItem(id: string) {
    this.isLoading = true;
    this.errorMsg = '';
    this.merchService.getMerchItemById(id).subscribe({
      next: (response) => {
        this.merch = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/merchandising']);
  }

  formatPrice(cents: number, currency: string) {
    if (cents === 0 || cents == null) return 'Gratis';
    return `${(cents / 100).toFixed(2)} ${currency ?? 'EUR'}`;
  }

  isInStock(): boolean {
    return !!this.merch?.stock && this.merch.stock > 0;
  }
}
