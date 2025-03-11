import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  let clonedRequest = req;
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  return next(clonedRequest).pipe(
    catchError((error) => {
      // Handle different status codes
      if (error.status === 401) {
        // 401 Unauthorized - Token may be expired or invalid
        console.warn('Unauthorized (401): Redirecting to login.');
        //authService.logout();
      } else if (error.status === 403) {
        // 403 Forbidden - User doesn't have permission
        console.warn('Forbidden (403): Access denied.');
      } else if (error.status === 404) {
        // 404 Not Found - API route might be incorrect
        console.warn('Not Found (404): The requested resource was not found.');
      } else if (error.status === 500) {
        // 500 Internal Server Error - Issue with the backend
        console.error('Server Error (500): Something went wrong on the server.');
      } else {
        // Handle other status codes generically
        console.error(`HTTP Error (${error.status}):`, error.message);
      }

      return throwError(() => error); // Rethrow the error so other parts of the app can handle it
    })
  );
  
};
