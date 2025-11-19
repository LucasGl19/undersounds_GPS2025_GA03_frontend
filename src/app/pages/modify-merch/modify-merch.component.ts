import { Component, OnInit } from '@angular/core';
import { MerchItem } from '../../models/merch-item.model';
import { AuthService } from '../../services/auth.service';
import { MerchService } from '../../services/merch.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modify-merch',
  imports: [FormsModule, CommonModule],
  templateUrl: './modify-merch.component.html',
  styleUrl: './modify-merch.component.css',
})
export class ModifyMerchComponent implements OnInit {
  merch: MerchItem[] = [];
  openedItemId: number | null = null;
  modalOpen = false;
  selectedItem: MerchItem | null = null;
  editableItem: any = {};

  constructor(private auth: AuthService, private merchService: MerchService) {}

  ngOnInit(): void {
    const artistId = 1;
    this.merchService.getArtistMerch(artistId).subscribe({
      next: (response) => {
        this.merch = response.data;
      },
      error: (err) => {
        console.error('Error fetching merch items for artist', err);
      },
    });
  }

  openEditionModal(item: MerchItem) {
    this.selectedItem = item;
    this.editableItem = { ...item };
    this.modalOpen = true;
  }

  closeEditionModal() {
    this.modalOpen = false;
  }

  saveChanges() {
    if (!this.selectedItem) return;
    Object.assign(this.selectedItem, this.editableItem);
    this.closeEditionModal();
  }
}
