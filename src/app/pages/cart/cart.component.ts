import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from '../../models/cart-item.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

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
  isLoggedIn = false;

  constructor(
    private router: Router, 
    private cart: CartService,
    private authService: AuthService
  ) {
    this.sub = this.cart.items$.subscribe(items => (this.cartItems = items));
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
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
    // Verificar si el usuario está autenticado
    if (!this.isLoggedIn) {
      // Guardar la URL actual para redirigir después del login
      const returnUrl = '/checkout';
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl } 
      });
      return;
    }

    // Navegar a la página de checkout
    this.router.navigate(['/checkout']);
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
