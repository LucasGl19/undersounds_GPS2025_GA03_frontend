import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
    user = {
    name: 'Usuario Ejemplo',
    email: 'usuarioejemplo@undersound.com',
    image: 'assets/usuario.png'
  };
}
