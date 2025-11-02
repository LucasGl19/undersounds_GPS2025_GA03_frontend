import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchandising',
  imports: [CommonModule],
  templateUrl: './merchandising.component.html',
  styleUrls: ['./merchandising.component.css']
})
export class MerchandisingComponent {
  articles = [
    { name: 'Camiseta Undersound', price: 20, image: 'imagenes/rectangle.svg' },
    { name: 'Taza Undersound', price: 10, image: 'imagenes/rectangle.svg' },
    { name: 'Sudadera Undersound', price: 5, image: 'imagenes/rectangle.svg' },

  ]
}
