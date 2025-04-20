// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(this.apiUrl + '/login', credentials);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // ✅ Decode token and get user data
  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  // ✅ Get current user role
  getUserRole(): string | null {
    const user = this.getUserFromToken();
    return user ? user.role : null;
  }

  // ✅ Get user ID
  getUserId(): number | null {
    const user = this.getUserFromToken();
    return user ? user.userId : null;
  }
}
