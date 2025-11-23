import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Album } from '../models/album.model';

const STORAGE_KEY = 'undersounds_cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  items$ = this.itemsSubject.asObservable();

  shippingCost = 4.99;

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[CartService] Error leyendo localStorage', e);
      return [];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSubject.value));
    } catch (e) {
      console.warn('[CartService] Error guardando localStorage', e);
    }
  }

  addAlbum(album: Album) {
    const existing = this.itemsSubject.value.find(i => i.itemType === 'album' && String(i.id) === String(album.id));
    if (existing) {
      existing.quantity++;
      this.itemsSubject.next([...this.itemsSubject.value]);
    } else {
      const newItem: CartItem = {
        id: album.id,
        itemType: 'album',
        name: album.title,
        price: album.price || 0,
        image: album.cover,
        quantity: 1,
      };
      this.itemsSubject.next([...this.itemsSubject.value, newItem]);
    }
    this.persist();
  }

  updateQuantity(item: CartItem, delta: number) {
    const items = this.itemsSubject.value.map(i => {
      if (i === item) {
        const qty = i.quantity + delta;
        i.quantity = qty < 1 ? 1 : qty;
      }
      return i;
    });
    this.itemsSubject.next(items);
    this.persist();
  }

  remove(item: CartItem) {
    const items = this.itemsSubject.value.filter(i => i !== item);
    this.itemsSubject.next(items);
    this.persist();
  }

  clear() {
    this.itemsSubject.next([]);
    this.persist();
  }

  getSubtotal(): number {
    return parseFloat(this.itemsSubject.value.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2));
  }

  getTotal(): number {
    return parseFloat((this.getSubtotal() + (this.itemsSubject.value.length ? this.shippingCost : 0)).toFixed(2));
  }
}
