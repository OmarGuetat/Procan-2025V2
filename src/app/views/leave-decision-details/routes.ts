import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./leave-decision-details.component').then(m => m.LeaveDecisionDetailsComponent),
    data: { title: 'Leave Decision Details' }
  }
];
