import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accountant-home.component').then(m => m.AccountantHomeComponent),
    data: {
      title: 'Accountant Home'
    }
  }
];
