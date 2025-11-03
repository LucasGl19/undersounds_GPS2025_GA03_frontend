import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(private router: Router) {}

  cartItems = [
    {
      name: 'Articulo 1',
      price: 19.99,
      quantity: 1,
      image: 'assets/art1.jpg',
    },
    {
      name: 'Articulo 2',
      price: 9.99,
      quantity: 2,
      image: 'assets/art2.jpg',
    },
  ];

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

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) item.quantity--;
    else this.removeFromCart(item);
  }

  removeFromCart(item: any) {
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
