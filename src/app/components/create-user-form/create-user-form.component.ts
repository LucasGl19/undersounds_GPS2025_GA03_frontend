import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CreateUserDto } from '../../services/user.service';

@Component({
  selector: 'app-create-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css'],
})
export class CreateUserFormComponent {
  @Output() userCreated = new EventEmitter<CreateUserDto>();
  @Output() cancelled = new EventEmitter<void>();

  createUserForm: FormGroup;
  showForm = false;

  roles = [
    { value: 'listener', label: 'Oyente' },
    { value: 'artist', label: 'Artista' },
    { value: 'admin', label: 'Administrador' },
  ];

  constructor(private fb: FormBuilder) {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['listener', Validators.required],
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.createUserForm.reset({ role: 'listener' });
    }
  }

  onSubmit(): void {
    if (this.createUserForm.valid) {
      const userData: CreateUserDto = this.createUserForm.value;
      this.userCreated.emit(userData);
      this.createUserForm.reset({ role: 'listener' });
      this.showForm = false;
    }
  }

  onCancel(): void {
    this.createUserForm.reset({ role: 'listener' });
    this.showForm = false;
    this.cancelled.emit();
  }
}
