import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service'; // Import the user service

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/login';
  private passwordResetConfirmUrl = 'http://127.0.0.1:8000/api/password/reset';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService // Inject the user service
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap(response => {
        console.log("Login response:", response);
        if (response.access_token && response.role) {
          this.saveToken(response.access_token);
          this.userService.setRole(response.role); // Set the role using the service
        } else {
          console.error("Invalid login response format:", response);
        }
      })
    );
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/password/email', { email });
  }

  resetPassword(token: string | null, newPassword: string): Observable<any> {
    return this.http.post<any>(this.passwordResetConfirmUrl, { token, new_password: newPassword, confirm_password: newPassword });
  }
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
