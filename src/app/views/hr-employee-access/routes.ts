import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
    path: 'leave-form',
    loadComponent: () => import('./leave-form/leave-form.component').then(m => m.LeaveFormComponent),
    data: {
      title: 'Leave Form'
    }
  },
  {
    path: 'requests-user-dashboard',
    loadComponent: () => import('./requests-user-dashboard/requests-user-dashboard.component').then(m => m.RequestsUserDashboardComponent),
    data: {
      title: 'My Requests'
    }
  }
    ]
  }
];
