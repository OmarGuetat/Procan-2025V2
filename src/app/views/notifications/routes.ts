import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Notifications'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./notifications.component').then(m => m.NotificationsComponent),
        data: {
          title: 'Notifications'
        }}
    ]
  }
];
