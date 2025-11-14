import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreateUserDto,
  User,
  UserListResponse,
  UserService,
} from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { CreateUserFormComponent } from '../../components/create-user-form/create-user-form.component';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    CreateUserFormComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;
  total: number = 0;
  page: number = 1;
  pageSize: number = 20;
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadUsers();
  }

  checkAdminRole(): void {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'admin';
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService
      .getUsers({ page: this.page, pageSize: this.pageSize })
      .subscribe({
        next: (response: UserListResponse) => {
          this.users = response.items;
          this.total = response.total;
          this.page = response.page;
          this.pageSize = response.pageSize;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 403) {
            this.error = 'No tienes permisos para ver los usuarios.';
          } else {
            this.error = 'No se pudieron cargar los usuarios.';
          }
          this.loading = false;
          console.error('Error al cargar usuarios:', err);
        },
      });
  }

  onCreateUser(userData: CreateUserDto): void {
    this.userService.createUser(userData).subscribe({
      next: () => {
        this.loadUsers();
        this.snackBar.open('Usuario creado con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al crear usuario:', err);
        const errorMsg = err.error?.mensaje || 'Error al crear usuario';
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  onDelete(userId: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.loadUsers();
            this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-success'],
            });
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-error'],
            });
          },
        });
      }
    });
  }
}
