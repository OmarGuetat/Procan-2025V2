import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Demande de Livraison'
    },
    children: [
      {
        path: 'company-settings',
        loadComponent: () => import('./invoices_settings/company-settings/company-settings.component').then(m => m.CompanySettingsComponent),
        data: {
          title: 'company settings'
        }
      }
    ]
  }
];
