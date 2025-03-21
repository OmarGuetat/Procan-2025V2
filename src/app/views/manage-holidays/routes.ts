import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manage-holidays.component').then(m => m.ManageHolidaysComponent),
    data: {
      title: 'Public Holidays'
    }
  }
];
