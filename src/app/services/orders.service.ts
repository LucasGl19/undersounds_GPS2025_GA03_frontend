import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';

export interface OrderItem {
  productId: string;
  productName: string;
  type: string; // "album" | "merch" | etc.
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly baseUrl = 'http://localhost:8083/v1/orders';
  purchasedItems: OrderItem[] = [];
  dummyOrders: Order[] = [
    {
      orderId: 'order007',
      userId: 'user003',
      orderDate: '2025-10-07T18:50:00Z',
      totalAmount: 20.0,
      items: [
        {
          productId: 'acbdd4ee-9c89-4390-ba93-610769269c1f',
          productName: 'prueba1',
          type: 'album',
          quantity: 2,
          unitPrice: 1.0,
        },
        {
          productId: '2556bc57-67fc-45d4-b095-0c5b4b2320cb',
          productName: 'prueba1',
          type: 'album',
          quantity: 2,
          unitPrice: 1.0,
        },
        {
          productId: '17ddcb85-0902-463b-95b3-783f6aa25b07',
          productName: 'prueba1',
          type: 'album',
          quantity: 2,
          unitPrice: 1.0,
        },
      ],
    },
  ];

  constructor(private http: HttpClient) {}

  hasPurchased(userId: string, productId: string, type: 'album' | 'track' | 'merch') {
    return this.getUserOrders(userId).pipe(
      map(orders => orders.some(order => order.items.some(
        (i=> i.productId === productId && i.type === type)
      )))
    );
  }

  getAllOrders() {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getOrderById(id: string) {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getUserOrders(userId: string) {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`);
  }

  createOrder(order: Order) {
    return this.http.post<Order>(this.baseUrl, order);
  }

  deleteOrder(orderId: string) {
    return this.http.delete(`${this.baseUrl}?id=${orderId}`);
  }
}
