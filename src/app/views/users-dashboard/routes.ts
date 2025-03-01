import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users Dashboard'
    },
    children: [
      {
        path: '',
        redirectTo: 'users-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'users-dashboard',
        loadComponent: () => import('./users-dashboard.component').then(m => m.UsersDashboardComponent),
        data: {
          title: 'Users Dashboard'
        }
      }
    ]
  }
];
