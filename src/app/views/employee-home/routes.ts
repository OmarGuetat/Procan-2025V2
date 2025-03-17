import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-home.component').then(m => m.EmployeeHomeComponent),
    data: {
      title: 'Employee Home'
    }
  }
];
