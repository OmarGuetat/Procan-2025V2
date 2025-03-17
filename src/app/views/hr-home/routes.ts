import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./hr-home.component').then(m => m.HrHomeComponent),
    data: {
      title: 'Hr Home'
    }
  }
];
