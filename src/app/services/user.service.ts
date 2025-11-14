import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string | null;
  username: string;
  role: string;
  email: string;
  createdAt: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface UserListResponse {
  items: User[];
  page: number;
  pageSize: number;
  total: number;
}

export interface UserListFilters {
  q?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: 'listener' | 'artist' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getUsers(filters: UserListFilters = {}): Observable<UserListResponse> {
    let params = new HttpParams();

    if (filters.q) {
      params = params.set('q', filters.q);
    }

    if (filters.role) {
      params = params.set('role', filters.role);
    }

    if (filters.page) {
      params = params.set('page', filters.page);
    }

    if (filters.pageSize) {
      params = params.set('pageSize', filters.pageSize);
    }

    return this.http.get<UserListResponse>(`${this.apiUrl}/users`, { params });
  }

  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, dto);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  deleteSelfAccount(): Observable<void> {

    // Cambiar por el endpoint real (no existe en el backend)
    return of(undefined).pipe(delay(300));
  }
}
