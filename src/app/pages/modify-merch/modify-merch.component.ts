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
  styleUrl: './modify-merch.component.css'
})
export class ModifyMerchComponent implements OnInit{
  merch: MerchItem[] = [];
  openedItemId: number | null = null;
  modalOpen = false;
  selectedItem: MerchItem | null = null;
  editableItem: any = {};
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(private auth: AuthService, private merchService: MerchService){};

  ngOnInit(): void {
    this.loadMyMerch();
  }

  private loadMyMerch(): void {
    const userId = this.auth.getUserId();
    if (!userId) {
      this.errorMessage = 'Debes iniciar sesión para ver tu merchandising';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Filtrar merch por artistId (el userId del artista logueado)
    // Nota: el backend espera artistId como string (no se parsea a número)
    this.merchService.getMerchItems({ artistId: userId }).subscribe({
      next: (response) => {
        this.merch = response.data;
        this.isLoading = false;
        console.log('[ModifyMerch] Loaded', this.merch.length, 'items for artistId', userId);
      },
      error: (err) => {
        console.error('[ModifyMerch] Error loading merch:', err);
        this.errorMessage = 'Error cargando tu merchandising';
        this.isLoading = false;
      }
    });
  }

  openEditionModal(item : MerchItem) {
    this.selectedItem = item;
    this.editableItem = {... item};
    this.modalOpen = true;
  }

  closeEditionModal() {
    this.modalOpen = false;
  }

  saveChanges() {
    if (!this.selectedItem) return;

    // Preparar body para PATCH /merch/{merchId}
    const updateDto: any = {};
    if (this.editableItem.title !== this.selectedItem.title) {
      updateDto.name = this.editableItem.title;
    }
    if (this.editableItem.priceCents !== this.selectedItem.priceCents) {
      updateDto.price = this.editableItem.priceCents / 100; // backend espera euros
    }
    if (this.editableItem.description !== this.selectedItem.description) {
      updateDto.description = this.editableItem.description;
    }
    if (this.editableItem.stock !== this.selectedItem.stock) {
      updateDto.stock = this.editableItem.stock;
    }

    // Si no hay cambios, cerrar modal
    if (Object.keys(updateDto).length === 0) {
      this.closeEditionModal();
      return;
    }

    // Llamar al backend para actualizar
    this.merchService.updateMerch(this.selectedItem.id, updateDto).subscribe({
      next: (response) => {
        console.log('[ModifyMerch] Updated successfully:', response);
        // Actualizar item en lista local
        Object.assign(this.selectedItem!, response.data);
        this.closeEditionModal();
      },
      error: (err) => {
        console.error('[ModifyMerch] Error updating merch:', err);
        alert('Error al guardar los cambios');
      }
    });
  }
}
