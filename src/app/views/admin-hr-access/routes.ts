import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users-dashboard',
        loadComponent: () => import('./users-dashboard/users-dashboard.component').then(m => m.UsersDashboardComponent),
        data: {
          title: 'Users Dashboard'
        }
      },
      {
        path: 'leave-dashboard',
        loadComponent: () => import('./leave-dashboard/leave-dashboard.component').then(m => m.LeaveDashboardComponent),
        data: {
          title: 'Leave Dashboard'
        }
      }, 
      {
        path: 'leave-balance',
        loadComponent: () => import('./leave-balance/leave-balance.component').then(m => m.LeaveBalanceComponent),
        data: {
          title: 'Leave Balances'
        }
      }
      , 
      {
        path: 'leave-requests/:id',
        loadComponent: () => import('./request-dashboard/request-dashboard.component').then(m => m.RequestDashboardComponent),
      }
      , 
      {
        path: 'leave-balance-details/:id',
        loadComponent: () => import('./leave-details/leave-details.component').then(m => m.LeaveDetailsComponent),
      }
    ]
  }
];
