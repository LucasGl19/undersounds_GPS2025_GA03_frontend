import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDto } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly passwordMatchValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirm = control.get('confirm')?.value;

    if (!password || !confirm) {
      return null;
    }

    return password === confirm ? null : { passwordMismatch: true };
  };

  readonly registerForm: FormGroup = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
      role: ['listener', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal<string | null>(null);

  readonly passwordMismatch = computed(() =>
    this.registerForm.hasError('passwordMismatch') &&
    (this.registerForm.get('confirm')?.touched || this.submitted())
  );

  get username(): AbstractControl | null {
    return this.registerForm.get('username');
  }

  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirm(): AbstractControl | null {
    return this.registerForm.get('confirm');
  }

  get role(): AbstractControl | null {
    return this.registerForm.get('role');
  }

  submit(): void {
    this.submitted.set(true);
    this.apiError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue() as RegisterDto & { confirm: string };
    const { confirm: _confirm, ...dto } = formValue;
    this.submitting.set(true);

    this.authService
      .register(dto as RegisterDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.storeTokens(response.tokens);
          this.submitting.set(false);
          this.router.navigateByUrl('/profile');
        },
        error: (error) => {
          const message = error?.error?.message ?? 'No se pudo completar el registro.';
          this.apiError.set(message);
          this.submitting.set(false);
        },
        complete: () => {
          this.submitting.set(false);
        },
      });
  }
}
