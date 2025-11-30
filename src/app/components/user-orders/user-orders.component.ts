import { Component, Input, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Order, OrdersService } from '../../services/orders.service';
import { AlbumsService } from '../../services/albums.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-orders',
  imports: [CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css'],
})
export class UserOrdersComponent implements OnInit {
  @Input() userId!: string;
  orders: Order[] = [];
  loading = false;

  constructor(private ordersService: OrdersService) {}

  async ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.ordersService.getUserOrders(this.userId).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
