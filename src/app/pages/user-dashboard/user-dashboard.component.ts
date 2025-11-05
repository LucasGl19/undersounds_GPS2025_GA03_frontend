import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../component/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule, MatDialogModule, ConfirmDialogComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log('Data gathered:', data);
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.log(err);
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
