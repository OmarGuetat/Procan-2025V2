import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Testing'
    },
    children: [
      {
        path: '',
        redirectTo: 'tests',
        pathMatch: 'full'
      },
      {
        path: 'test',
        loadComponent: () => import('./test/test.component').then(m => m.TestComponent),
        data: {
          title: 'test'
        }
      },
    
    ]
  }
];

