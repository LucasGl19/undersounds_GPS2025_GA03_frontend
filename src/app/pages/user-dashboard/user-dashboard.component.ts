import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  User,
  UserListResponse,
  UserService,
} from '../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, ConfirmDialogComponent],
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

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
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
