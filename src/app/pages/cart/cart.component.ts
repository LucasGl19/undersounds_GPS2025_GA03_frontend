import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnDestroy {
  cartItems: CartItem[] = [];
  private sub: Subscription;

  constructor(private router: Router, private cart: CartService) {
    this.sub = this.cart.items$.subscribe(items => (this.cartItems = items));
  }

  // Getter para el coste de envío (lo provee el servicio)
  get shippingCost() {
    return this.cart.shippingCost;
  }

  getSubtotal() {
    return this.cart.getSubtotal();
  }

  getTotal() {
    return this.cart.getTotal().toFixed(2);
  }

  increaseQuantity(item: CartItem) {
    this.cart.updateQuantity(item, +1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity === 1) {
      this.removeFromCart(item);
    } else {
      this.cart.updateQuantity(item, -1);
    }
  }

  removeFromCart(item: CartItem) {
    this.cart.remove(item);
  }

  clearCart() {
    this.cart.clear();
  }

  checkout() {
    alert('Placeholder para el proceso de compra.');
  }

  navigateToSongs() {
    this.router.navigate(['/songs']);
  }

  navigateToMerch() {
    this.router.navigate(['/merchandising']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
