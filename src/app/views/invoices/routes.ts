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
      },
      {
        path: 'invoice-form',
        loadComponent: () => import('./invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent),
        data: {
          title: 'invoice form'
        }
      },
      {
        path: 'invoices-dashboard',
        loadComponent: () => import('./invoices-dashboard/invoices-dashboard.component').then(m => m.InvoicesDashboardComponent),
        data: {
          title: 'Invoices Dashboard'
        }
      }
    ]
  }
];
