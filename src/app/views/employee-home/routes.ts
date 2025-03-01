import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employee Home'
    },
    children: [
      {
        path: '',
        redirectTo: 'employee-home',
        pathMatch: 'full'
      },
      {
        path: 'employee-home',
        loadComponent: () => import('./employee-home.component').then(m => m.EmployeeHomeComponent),
        data: {
          title: 'Employee Home'
        }
      }
    ]
  }
];
