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
    const userRole = this.authService.getRole() ?? 'guest'; // Fallback to 'guest' if no role is set
    const isLoginOrReset = route.routeConfig?.path === 'login' || route.routeConfig?.path === 'reset-password';

    // If not authenticated
    if (!isAuthenticated) {
      if (!isLoginOrReset) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    }

    // Handle role-based route access
    const rolePrefix = userRole; // role prefix like 'admin', 'employee', 'hr', etc.
    const requestedRoutePath = route.url[0].path;

    // Check if the requested route starts with the correct role prefix
    if (!requestedRoutePath.startsWith(rolePrefix)) {
      // Redirect user to their respective homepage if they try to access a route that doesn't match their role prefix
      this.router.navigate([this.getHomeRoute(userRole)]);
      return false;
    }

    // If route is valid for the user role, grant access
    return true;
  }

  // Get home route based on user role
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
