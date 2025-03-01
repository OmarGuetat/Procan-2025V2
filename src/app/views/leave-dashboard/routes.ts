import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Leave Dashboard'
    },
    children: [
      {
        path: '',
        redirectTo: 'leave-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'leave-dashboard',
        loadComponent: () => import('./leave-dashboard.component').then(m => m.LeaveDashboardComponent),
        data: {
          title: 'Leave Dashboard'
        }
      }
    ]
  }
];
