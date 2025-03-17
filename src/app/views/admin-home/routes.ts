import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-home.component').then(m => m.AdminHomeComponent),
    data: {
      title: 'Admin Home'
    }
  }
];
