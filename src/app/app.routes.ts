import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { LoginComponent } from './pages/login/login.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // 1. Login page
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },

  // 2. Reset Password page
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },

  // 3. Default Layout with children (only after login, protected by AuthGuard)
  {
    path: 'main',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
    {
      path: 'notifications',
      loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
    },
    // Profile
    {
      path: 'profile',
      loadChildren: () => import('./views/profile/routes').then((m) => m.routes)
    },
      {
        path: '',
        loadChildren: () => import('./views/invoices/routes').then(m => m.routes)
      },
    {
      path: 'admin-home',
      loadChildren: () => import('./views/admin-home/routes').then((m) => m.routes)
    },
    {
      path: 'manage-holidays',
      loadChildren: () => import('./views/manage-holidays/routes').then((m) => m.routes)
    },
    {
      path: 'leave-balance',
      loadChildren: () => import('./views/leave-balance/routes').then((m) => m.routes)
    },
    {
      path: 'admin-home',
      loadChildren: () => import('./views/admin-home/routes').then((m) => m.routes)
    },
    {
      path: 'employee-home',
      loadChildren: () => import('./views/employee-home/routes').then((m) => m.routes)
    },
    {
      path: 'hr-home',
      loadChildren: () => import('./views/hr-home/routes').then((m) => m.routes)
    },
    // Users Dashboard
    {
      path: 'users-dashboard',
      loadChildren: () => import('./views/users-dashboard/routes').then((m) => m.routes)
    },
    // Leave Dashboard
    {
      path: 'leave-dashboard',
      loadChildren: () => import('./views/leave-dashboard/routes').then((m) => m.routes)
    },
    // Leave Form
    {
      path: 'leave-form',
      loadChildren: () => import('./views/leave-form/routes').then((m) => m.routes)
    },
    // Requests User Dashboard
    {
      path: 'requests-user-dashboard',
      loadChildren: () => import('./views/requests-user-dashboard/routes').then((m) => m.routes)
    }
    ]
  },

  // 4. Wildcard route to redirect any undefined paths to login
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
