type CartItem = {
  name: string;
  price: number;
  quantity: number;
  image: string;
};

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  constructor(private router: Router) {}

  cartItems: CartItem[] = [];

  shippingCost = 4.99;

  getSubtotal() {
    const subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return parseFloat(subtotal.toFixed(2));
  }

  getTotal() {
    return (this.getSubtotal() + this.shippingCost).toFixed(2);
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) item.quantity--;
    else this.removeFromCart(item);
  }

  removeFromCart(item: CartItem) {
    this.cartItems = this.cartItems.filter((i) => i !== item);
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
}
