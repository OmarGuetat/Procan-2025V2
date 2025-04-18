import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./leave-dashboard.component').then(m => m.LeaveDashboardComponent),
    data: {
      title: 'Leave Dashboard'
    }
  }
];
