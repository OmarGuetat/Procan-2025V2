import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.authService.getRole();
    if (isAuthenticated) {
      // Redirect to home page for authenticated users trying to access login or reset_password
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'reset-password') {
        this.router.navigate([this.getHomeRoute(userRole || 'guest')]);
        return false;
      }
    }
    // If not authenticated, allow access to the route 
    return true;
  }
  private getHomeRoute(role: string): string {
    switch (role) {
      case 'admin': return '/admin/home';
      case 'employee': return '/employee/home';
      case 'accountant': return '/accountant/home';
      case 'hr': return '/hr/home';
      default: return '/login';
    }
  }
}

