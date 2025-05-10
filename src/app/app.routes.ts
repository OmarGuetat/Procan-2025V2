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

  // 3. Admin Routes
  {
    path: 'admin',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', loadChildren: () => import('./views/admin-home/routes').then((m) => m.routes) },
      { path: 'users-dashboard', loadChildren: () => import('./views/users-dashboard/routes').then((m) => m.routes) },
      { path: 'leave-dashboard', loadChildren: () => import('./views/leave-dashboard/routes').then((m) => m.routes) },
      { path: 'leave-balance', loadChildren: () => import('./views/leave-balance/routes').then((m) => m.routes) },
      { path: 'manage-holidays', loadChildren: () => import('./views/manage-holidays/routes').then((m) => m.routes) },
     
      { path: '', loadChildren: () => import('./views/invoices/routes').then((m) => m.routes) },
     
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      {
        path: 'leave-decision-details/:id',loadChildren: () =>import('./views/leave-decision-details/routes').then(m => m.routes)
      },
      { path: 'profile', loadChildren: () => import('./views/profile/routes').then((m) => m.routes) },
    ]
  },

  // 4. Employee Routes
  {
    path: 'employee',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', loadChildren: () => import('./views/employee-home/routes').then((m) => m.routes) },
      { path: 'leave-form', loadChildren: () => import('./views/leave-form/routes').then((m) => m.routes) },
      { path: 'requests-user-dashboard', loadChildren: () => import('./views/requests-user-dashboard/routes').then((m) => m.routes) },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      { path: 'profile', loadChildren: () => import('./views/profile/routes').then((m) => m.routes) },
    ]
  },

  // 5. HR Routes
  {
    path: 'hr',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'hr-home', loadChildren: () => import('./views/hr-home/routes').then((m) => m.routes) },
      { path: 'users-dashboard', loadChildren: () => import('./views/users-dashboard/routes').then((m) => m.routes) },
      { path: 'leave-balance', loadChildren: () => import('./views/leave-balance/routes').then((m) => m.routes) },
      { path: 'leave-dashboard', loadChildren: () => import('./views/leave-dashboard/routes').then((m) => m.routes) },
      { path: 'leave-form', loadChildren: () => import('./views/leave-form/routes').then((m) => m.routes) },
      { path: 'requests-user-dashboard', loadChildren: () => import('./views/requests-user-dashboard/routes').then((m) => m.routes) },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      { path: 'profile', loadChildren: () => import('./views/profile/routes').then((m) => m.routes) },
    ]
  },

 // 6. Accountant Routes
{
  path: 'accountant',
  component: DefaultLayoutComponent,
  canActivate: [AuthGuard],
  children: [
    { 
      path: '', 
      loadChildren: () => import('./views/accountant-acess/routes').then(m => m.routes) 
    },
    { 
      path: 'notifications', 
      loadChildren: () => import('./views/notifications/routes').then(m => m.routes) 
    },
    { 
      path: 'profile', 
      loadChildren: () => import('./views/profile/routes').then(m => m.routes) 
    },
    { path: '', loadChildren: () => import('./views/invoices/routes').then((m) => m.routes) },
  ]
},


  // 7. Wildcard route to redirect any undefined paths to login
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
