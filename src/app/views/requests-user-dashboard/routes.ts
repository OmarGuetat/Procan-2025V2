import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Requests'
    },
    children: [
      {
        path: '',
        redirectTo: 'requests-user-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'requests-user-dashboard',
        loadComponent: () => import('./requests-user-dashboard.component').then(m => m.RequestsUserDashboardComponent),
        data: {
          title: 'Requests User Dashboard'
        }
      }
    ]
  }
];
