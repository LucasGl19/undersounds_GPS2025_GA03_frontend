import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: any) {
    if (!form.valid) return;

    const { email, password } = form.value;
    console.log('Email:', email);
    console.log('Password:', password);

    // Implementar lógica de autenticación
    

    // Simular un token recibido del servidor

    // Actualizar el estado de autenticación
    this.authService.login('dummy-token');
    this.router.navigate(['/']);
  }
}
