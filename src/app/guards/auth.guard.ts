import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = this.userService.getRole();
    if (isAuthenticated) {
      // Redirect to home page for authenticated users trying to access login or reset_password
      if (route.routeConfig?.path === 'login' || route.routeConfig?.path === 'reset-password') {
        this.router.navigate(['/main']);
        return false;
      }
    }
    // If not authenticated, allow access to the route 
    return true;
  }
  
}

