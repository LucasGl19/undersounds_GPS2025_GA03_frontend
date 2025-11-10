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

    const { emailOrUsername, password } = form.value;
    console.log('Email or Username:', emailOrUsername);
    console.log('Password:', password);

    this.authService.login(emailOrUsername, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
