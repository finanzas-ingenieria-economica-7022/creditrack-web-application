import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ChangePasswordRequest,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '../models/iam.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_URL = '/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly TOKEN_TYPE_KEY = 'tokenType';
  private readonly USERNAME_KEY = 'username';
  private readonly EMAIL_KEY = 'email';
  private readonly ROLE_KEY = 'role';
  private readonly PERMISSIONS_KEY = 'permissions';
  private readonly EXPIRES_AT_KEY = 'expiresAt';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, { username, password }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/register`, userData).pipe(
      tap(response => this.saveSession(response))
    );
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/refresh-token`, { refreshToken }).pipe(
      tap(response => this.saveSession(response))
    );
  }

  logout(): Observable<void> {
    const headers = this.buildAuthHeaders();
    const body: LogoutRequest = {
      refreshToken: this.getRefreshToken()
    };

    return this.http.post<void>(`${this.AUTH_URL}/logout`, body, { headers }).pipe(
      tap(() => this.clearSession())
    );
  }

  logoutAll(): Observable<void> {
    const headers = this.buildAuthHeaders();
    return this.http.post<void>(`${this.AUTH_URL}/logout-all`, {}, { headers }).pipe(
      tap(() => this.clearSession())
    );
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.AUTH_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    const body: ResetPasswordRequest = { token, newPassword };
    return this.http.post<void>(`${this.AUTH_URL}/reset-password`, body);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const body: ChangePasswordRequest = { currentPassword, newPassword };
    return this.http.post<void>(`${this.AUTH_URL}/change-password`, body, { headers: this.buildAuthHeaders() });
  }

  saveSession(session: LoginResponse): void {
    if (!session?.accessToken) {
      return;
    }

    localStorage.setItem(this.TOKEN_KEY, session.accessToken);
    localStorage.setItem(this.ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, session.refreshToken);
    localStorage.setItem(this.TOKEN_TYPE_KEY, session.tokenType ?? 'Bearer');
    localStorage.setItem(this.USERNAME_KEY, session.username ?? '');
    localStorage.setItem(this.EMAIL_KEY, session.email ?? '');
    localStorage.setItem(this.ROLE_KEY, session.role ?? '');
    localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(session.permissions ?? []));
    localStorage.setItem(this.EXPIRES_AT_KEY, session.expiresAt ?? '');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.EMAIL_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getPermissions(): string[] {
    const rawPermissions = localStorage.getItem(this.PERMISSIONS_KEY);
    if (!rawPermissions) {
      return [];
    }

    try {
      const permissions = JSON.parse(rawPermissions) as unknown;
      return Array.isArray(permissions)
        ? permissions.filter((permission): permission is string => typeof permission === 'string')
        : [];
    } catch {
      return [];
    }
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.length === 0 || permissions.some(permission => this.hasPermission(permission));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    localStorage.removeItem(this.EMAIL_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  buildAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}
