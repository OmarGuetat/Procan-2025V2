import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-invoice-services',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoice-services.component.html',
})
export class InvoiceServicesComponent implements OnInit {
  invoiceId!: number;
  services: any[] = [];
  totals = {
    TTotal_HT: 0,
    TTotal_TVA: 0,
    TTotal_TTC: 0,
  };

  alertMessage: string | null = null;
  alertType: 'alert-success' | 'alert-danger' = 'alert-success';

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.invoiceId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchServices();
  }

  dismissAlert(): void {
    this.alertMessage = null;
  }

  showAlert(message: string, type: 'alert-success' | 'alert-danger') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.dismissAlert(), 2000);
  }

  fetchServices(): void {
    this.invoiceService.getServicesByInvoice(this.invoiceId).subscribe({
      next: (res: any) => {
        this.services = res.data || [];
        this.updateCalculations();

      },
      error: () => {
        this.showAlert('Failed to fetch services.', 'alert-danger');
      },
    });
  }

  updateCalculations(): void {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;
  
    this.services.forEach(service => {
      service.total_ht = service.quantity * service.price_ht;
      const serviceTVA = (service.total_ht * service.tva) / 100;
      service.total_ttc = service.total_ht + serviceTVA;
  
      totalHT += service.total_ht;
      totalTVA += serviceTVA;
      totalTTC += service.total_ttc;
    });
  
    this.totals.TTotal_HT = totalHT;
    this.totals.TTotal_TVA = totalTVA;
    this.totals.TTotal_TTC = totalTTC;
  }
  

  onUpdateAllServices(): void {
    const hasNegative = this.services.some(
      (s) => s.quantity < 0 || s.price_ht < 0 || s.tva < 0
    );
    const isServiceValid = this.services.some(
      (s) => s.name && s.quantity !== null && s.price_ht !== null
    );

    if (!isServiceValid) {
      this.showAlert('Please fill in at least one valid service.', 'alert-danger');
      return;
    }

    if (hasNegative) {
      this.showAlert('Values cannot be negative.', 'alert-danger');
      return;
    }
    const payload = {
      services: this.services,
      TTotal_HT: this.totals.TTotal_HT,
      TTotal_TVA: this.totals.TTotal_TVA,
      TTotal_TTC: this.totals.TTotal_TTC,
    };
    this.invoiceService.updateServicesBatch(payload).subscribe({
      next: (res: any) => {
        this.showAlert(res.message || 'Avoir Created successfully and a new facture has been created.', 'alert-success');
        this.fetchServices();
      },
      error: (err) => {
        const msg = err?.error?.error || 'Failed to update services';
        this.showAlert(msg, 'alert-danger');
      },
    });
  }

  goBack(): void {
    const role = this.authService.getRole();
    const rolePrefix = this.getRolePrefix(role);
    this.router.navigate([`/${rolePrefix}/invoices-dashboard`]);
  }

  private getRolePrefix(role: string | null): string {
    switch (role) {
      case 'admin':
        return 'admin';
      case 'accountant':
        return 'accountant';
      default:
        return 'login';
    }
  }
}
