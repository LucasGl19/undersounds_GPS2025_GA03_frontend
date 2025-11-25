import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

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

export interface CreateOrderRequest {
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

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las órdenes
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una orden específica por ID
   */
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todas las órdenes de un usuario específico
   */
  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva orden
   */
  createOrder(order: Order | CreateOrderRequest): Observable<Order> {
    // NO enviar orderId - el backend lo genera automáticamente
    // Asegurar que la estructura sea correcta para el backend
    const orderPayload = {
      userId: order.userId,
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        type: item.type,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    return this.http.post<Order>(this.baseUrl, orderPayload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una orden por ID
   */
  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en OrdersService:', error);
    
    let errorMessage = 'Ha ocurrido un error en el servidor';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 400) {
        errorMessage = 'Petición inválida';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
