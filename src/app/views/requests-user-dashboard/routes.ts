import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./requests-user-dashboard.component').then(m => m.RequestsUserDashboardComponent),
    data: {
      title: 'My Requests'
    }
  }
];

