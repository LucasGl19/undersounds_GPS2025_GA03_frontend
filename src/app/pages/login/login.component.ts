import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener la URL de retorno de los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(form: any) {
    if (!form.valid) return;

    const { emailOrUsername, password } = form.value;
    console.log('Email or Username:', emailOrUsername);
    console.log('Password:', password);

    // Limpiar mensaje de error previo
    this.errorMessage = '';

    this.authService.login(emailOrUsername, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Redirigir a la URL de retorno o al home
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'El usuario o contraseña son incorrectos';
      },
    });
  }
}
