import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./leave-form.component').then(m => m.LeaveFormComponent),
    data: {
      title: 'Leave Form'
    }
  }
];
