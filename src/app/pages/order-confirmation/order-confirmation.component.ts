import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../services/orders.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css',
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  currentDate: Date = new Date();

  constructor(private router: Router) {
    // Obtener la orden del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.order = navigation.extras.state['order'];
    }
  }

  ngOnInit(): void {
    // Si no hay orden, redirigir al inicio
    if (!this.order) {
      console.warn('No order data found, redirecting to home');
      this.router.navigate(['/']);
    }
  }

  get orderTotal(): number {
    if (!this.order) return 0;
    return this.order.totalAmount;
  }

  get itemsCount(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/songs']);
  }

  viewMyOrders(): void {
    this.router.navigate(['/user-dashboard']);
  }

  printOrder(): void {
    window.print();
  }
}
