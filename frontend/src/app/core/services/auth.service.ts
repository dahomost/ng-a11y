import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../auth-storage';
import type { UserDto } from '../../shared/models/api.types';

export interface AuthResponse {
  token: string;
  user: UserDto;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<UserDto | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly role = computed(() => this._user()?.role ?? null);
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private readonly http: HttpClient) {
    this.restore();
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  register(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, { email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    this._token.set(null);
    this._user.set(null);
  }

  canManageCatalog(): boolean {
    const r = this._user()?.role;
    return r === 'LIBRARIAN' || r === 'ADMIN';
  }

  isAdmin(): boolean {
    return this._user()?.role === 'ADMIN';
  }

  private persist(res: AuthResponse): void {
    sessionStorage.setItem(AUTH_TOKEN_KEY, res.token);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    this._token.set(res.token);
    this._user.set(res.user);
  }

  private restore(): void {
    const t = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const u = sessionStorage.getItem(AUTH_USER_KEY);
    if (t && u) {
      try {
        this._token.set(t);
        this._user.set(JSON.parse(u) as UserDto);
      } catch {
        this.logout();
      }
    }
  }
}
