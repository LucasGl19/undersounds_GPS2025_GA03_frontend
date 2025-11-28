import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService, Order, OrderItem } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  private sub?: Subscription;
  isProcessing = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cart: CartService,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.cart.items$.subscribe((items) => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    this.checkoutForm = this.fb.group({
      // Datos de envío
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['España', Validators.required],

      // Método de pago
      paymentMethod: ['card', Validators.required],
      
      // Datos de tarjeta (OPCIONAL - simulado, no se validan realmente)
      cardNumber: [''],
      cardName: [''],
      cardExpiry: [''],
      cardCVV: [''],

      // Aceptación de términos
      acceptTerms: [false, Validators.requiredTrue],
    });

    // NO hay validación condicional - todos los métodos de pago son simulados
  }

  get subtotal(): number {
    return this.cart.getSubtotal();
  }

  get shippingCost(): number {
    return this.cart.shippingCost;
  }

  get total(): number {
    return this.cart.getTotal();
  }

  get isFormValid(): boolean {
    return this.checkoutForm.valid && !this.isProcessing;
  }

  async processPayment(): Promise<void> {
    if (!this.isFormValid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.isProcessing = true;
    this.error = null;

    try {
      const userId = this.authService.getUserId();
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

      // Convertir items del carrito a OrderItems
      const orderItems: OrderItem[] = this.cartItems.map((item) => ({
        productId: String(item.id),
        productName: item.name,
        type: item.itemType,
        quantity: item.quantity,
        unitPrice: item.price,
      }));

      // Crear la orden (SIN orderId - lo genera el backend)
      const order: Omit<Order, 'orderId'> = {
        userId: userId,
        orderDate: new Date().toISOString(),
        totalAmount: this.total,
        items: orderItems,
      };

      // Simular procesamiento de pago
      await this.simulatePaymentProcessing(paymentMethod);

      // Enviar orden al backend
      this.ordersService.createOrder(order as Order).subscribe({
        next: (createdOrder) => {
          // Limpiar el carrito
          this.cart.clear();
          
          // Navegar a página de confirmación con el ID de la orden
          this.router.navigate(['/order-confirmation'], {
            state: { order: createdOrder },
          });
        },
        error: (err) => {
          console.error('Error al crear la orden:', err);
          this.error = 'Hubo un error al procesar tu pedido. Por favor, inténtalo de nuevo.';
          this.isProcessing = false;
        },
      });
    } catch (err: any) {
      console.error('Error en el proceso de pago:', err);
      this.error = err.message || 'Hubo un error inesperado. Por favor, inténtalo de nuevo.';
      this.isProcessing = false;
    }
  }

  private simulatePaymentProcessing(paymentMethod: string): Promise<void> {
    return new Promise((resolve) => {
      const delay = paymentMethod === 'paypal' ? 1500 : 2000;
      
      setTimeout(() => resolve(), delay);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  cancelCheckout(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
