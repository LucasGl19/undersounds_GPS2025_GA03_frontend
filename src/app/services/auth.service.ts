import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: 'artista' | 'oyente' | 'artist' | 'listener'; // Backend acepta ambos
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  role: string;
  tokens: AuthTokens;
}

export interface UserProfile {
  id?: string;
  name: string;
  username?: string;
  email: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface UserUpdateDto {
  username?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface DeleteAccountResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!this.getAccessToken());
  isLoggedIn$ = this.loggedIn.asObservable();
  private role = new BehaviorSubject<string | null>(
    localStorage.getItem('role')
  );
  userRole$ = this.role.asObservable();

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.usersApiUrl;

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, dto);
  }

  login(emailOrUsername: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        emailOrUsername,
        password,
      })
      .pipe(
        tap((response) => {
          console.log('[AuthService] Login response:', response);
          this.role.next(response.role);
          localStorage.setItem('role', response.role);
          localStorage.setItem('user_id', response.user_id.toString());
          console.log('[AuthService] Stored user_id:', response.user_id.toString());
          this.storeTokens(response.tokens);
          this.loggedIn.next(true);
        })
      );
  }

  me(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  updateProfile(data: UserUpdateDto): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.apiUrl}/me`, data);
  }

  deleteAccount(): Observable<DeleteAccountResponse> {
    return this.http.delete<DeleteAccountResponse>(`${this.apiUrl}/me`);
  }

  storeTokens(tokens: AuthTokens): void {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  }

  clearTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    this.role.next(null);
    this.loggedIn.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }


}
