import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./employee-home/employee-home.component').then(m => m.EmployeeHomeComponent),
        data: {
          title: 'Employee Home'
        }
      }
    ]
  }
];
