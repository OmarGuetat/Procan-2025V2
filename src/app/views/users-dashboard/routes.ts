import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-dashboard.component').then(m => m.UsersDashboardComponent),
    data: {
      title: 'Users Dashboard'
    }
  }
];
