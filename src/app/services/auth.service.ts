import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role: 'artist' | 'listener';
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
  private readonly apiUrl = environment.apiUrl;

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
          this.role.next(response.role);
          localStorage.setItem('role', response.role);
          localStorage.setItem('user_id', response.user_id.toString());
          this.storeTokens(response.tokens);
          this.loggedIn.next(true);
        })
      );
  }

  me(): Observable<UserProfile> {
    // return this.http.get<UserProfile>(`${this.apiUrl}/me`);
    const dummyProfile: UserProfile = {
      name: 'Jorge Carrasco',
      email: 'jorge@example.com',
      role: 'admin',
    };

    return of(dummyProfile).pipe(delay(1000));
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
    this.role.next(null);
    this.loggedIn.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserId():number | null {
    const id = localStorage.getItem('user_id');
      return id ? +id : null;
  }


}
