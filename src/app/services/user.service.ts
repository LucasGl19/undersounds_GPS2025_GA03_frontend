import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { delay, Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'artist' | 'listener';
  bio: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  dummyUsers: User[] = [
    {
      id: 1,
      username: 'Ana López',
      role: 'listener',
      bio: 'Amante del indie.',
    },
    {
      id: 2,
      username: 'Carlos Ruiz',
      role: 'artist',
      bio: 'Productor experimental.',
    },
    {
      id: 3,
      username: 'María Pérez',
      role: 'admin',
      bio: 'Gestiona la plataforma.',
    },
  ];

  userRole: string | null = null;
  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole();
  }

  getUsers(): Observable<User[]> {
    // return this.http.get<User[]>(`${this.apiUrl}/users`);

    // Dummy data

    return of(this.dummyUsers).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
    if (this.userRole !== 'admin') {
      return throwError(
        () => new Error('No tienes permisos para eliminar usuarios')
      ).pipe(delay(300));
    }
    const index = this.dummyUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      this.dummyUsers.splice(index, 1);
    }
    return of(undefined).pipe(delay(300));
  }
}
