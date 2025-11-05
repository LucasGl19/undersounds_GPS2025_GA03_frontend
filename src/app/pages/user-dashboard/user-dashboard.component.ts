import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        console.log('Data gathered:', data);
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.log(err);
      },
    });
  }
}
