import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
        data: {
          title: 'Admin Home'
        }
      },
      {
        path: 'manage-holidays',
        loadComponent: () => import('./manage-holidays/manage-holidays.component').then(m => m.ManageHolidaysComponent),
        data: {
          title: 'Public Holidays'
        }
      }
    ]
  }
];
