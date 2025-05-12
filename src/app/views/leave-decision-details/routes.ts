import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'leave-decision-details',
    loadComponent: () =>
      import('./leave-decision-details.component').then(m => m.LeaveDecisionDetailsComponent),
    data: { title: 'Leave Decision Details' }
  }
];
