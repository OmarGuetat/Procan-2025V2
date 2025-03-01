import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'admin-home',
        pathMatch: 'full'
      },
      {
        path: 'admin-home',
        loadComponent: () => import('./admin-home.component').then(m => m.AdminHomeComponent),
        data: {
          title: 'Admin Home'
        }
      }
    ]
  }
];
