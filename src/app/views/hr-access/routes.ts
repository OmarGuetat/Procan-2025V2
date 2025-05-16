import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./hr-home/hr-home.component').then(m => m.HrHomeComponent),
      }
    ]
  }
];
