import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service'; // Import the user service
import { environment } from 'src/environments/environment'; // Import environment for URLs

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth/login`; 
  private passwordResetConfirmUrl = `${environment.apiUrl}/password/reset`; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService // Inject the user service
  ) {}

  // Login method to authenticate the user
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      tap((response) => {
        console.log('Login response:', response);
        if (response.access_token && response.role) {
          this.saveToken(response.access_token);
          this.saveRole(response.role); // Save role to localStorage
          this.userService.setRole(response.role); // Set the role using the service
        } else {
          console.error('Invalid login response format:', response);
        }
      })
    );
  }

  // Forgot password method
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/password/email`, { email });
  }

  // Reset password method
  resetPassword(token: string | null, newPassword: string): Observable<any> {
    return this.http.post<any>(this.passwordResetConfirmUrl, {
      token,
      new_password: newPassword,
      confirm_password: newPassword,
    });
  }

  // Save the access token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get the access token from localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Save the user role to localStorage
  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  // Get the user role from localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Logout the user and remove the token and role from localStorage
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}
