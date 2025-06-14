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
      {
        path: 'leave-decision-details/:id',loadChildren: () =>import('./views/leave-decision-details/routes').then(m => m.routes)
      },
      { 
        path: '', 
        loadChildren: () => import('./views/admin-hr-access/routes').then(m => m.routes) 
      },
      { 
        path: '', 
        loadChildren: () => import('./views/admin-access/routes').then(m => m.routes) 
      },
      { path: 'leave-balance', loadChildren: () => import('./views/admin-hr-access/routes').then((m) => m.routes) },
      
      { path: '', loadChildren: () => import('./views/invoices/routes').then((m) => m.routes) },
     
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      
      { path: 'profile', loadChildren: () => import('./views/profile/routes').then((m) => m.routes) },

    ]
  },

  // 4. Employee Routes
  {
    path: 'employee',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        loadChildren: () => import('./views/employee-access/routes').then(m => m.routes) 
      },
      
      { 
        path: '', 
        loadChildren: () => import('./views/hr-employee-access/routes').then(m => m.routes) 
      },
      { path: 'notifications', loadChildren: () => import('./views/notifications/routes').then((m) => m.routes) },
      { path: 'profile', loadChildren: () => import('./views/profile/routes').then((m) => m.routes) },
      {
        path: 'leave-decision-details/:id',loadChildren: () =>import('./views/leave-decision-details/routes').then(m => m.routes)
      },
    ]
  },

  // 5. HR Routes
  {
    path: 'hr',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'leave-decision-details/:id',loadChildren: () =>import('./views/leave-decision-details/routes').then(m => m.routes)
      },
      { 
        path: '', 
        loadChildren: () => import('./views/admin-hr-access/routes').then(m => m.routes) 
      },
      { 
        path: '', 
        loadChildren: () => import('./views/hr-employee-access/routes').then(m => m.routes) 
      },
      { 
        path: '', 
        loadChildren: () => import('./views/hr-access/routes').then(m => m.routes) 
      },
    
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
