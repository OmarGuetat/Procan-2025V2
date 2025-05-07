import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Accountant' },
    children: [
      {
        path: 'home',
        loadComponent: () => import('./accountant-home/accountant-home.component').then(m => m.AccountantHomeComponent),
        data: { title: 'Accountant Home' }
      },
      {
        path: 'client-management',
        loadComponent: () => import('./client-management/client-management.component').then(m => m.ClientManagementComponent),
        data: { title: 'Client Management' }
      }
    ]
  }
];
