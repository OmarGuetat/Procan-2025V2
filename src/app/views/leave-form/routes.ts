import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Leave Form'
    },
    children: [
      {
        path: '',
        redirectTo: 'leave-form',
        pathMatch: 'full'
      },
      {
        path: 'leave-form',
        loadComponent: () => import('./leave-form.component').then(m => m.LeaveFormComponent),
        data: {
          title: 'Leave Form'
        }
      }
    ]
  }
];
