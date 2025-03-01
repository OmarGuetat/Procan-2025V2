import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'HR Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'hr-home',
        pathMatch: 'full'
      },
      {
        path: 'hr-home',
        loadComponent: () => import('./hr-home.component').then(m => m.HrHomeComponent),
        data: {
          title: 'HR Home'
        }
      }
    ]
  }
];
