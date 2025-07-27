import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:5044/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe();
    }
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, loginDto).pipe(
      tap((response) => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(registerDto: RegisterDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, registerDto)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  validateToken(): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(
      `${this.baseUrl}/validate-token`,
      {}
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roleName === role;
  }

  isHrAdmin(): boolean {
    return this.hasRole('HrAdmin');
  }

  isManager(): boolean {
    return this.hasRole('Manager');
  }

  isEmployee(): boolean {
    return this.hasRole('Employee');
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}
