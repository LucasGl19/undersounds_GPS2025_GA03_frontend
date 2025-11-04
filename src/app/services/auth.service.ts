import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'artista' | 'oyente';
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user_id: number;
  email: string;
  role: string;
  tokens: AuthTokens;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, dto);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password });
  }

  me(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }
}
