import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Accountant' },
    children: [
      {
        path: 'users-dashboard',
        loadComponent: () => import('./users-dashboard/users-dashboard.component').then(m => m.UsersDashboardComponent),
        data: {
          title: 'Users Dashboard'
        }
      }
    ]
  }
];
