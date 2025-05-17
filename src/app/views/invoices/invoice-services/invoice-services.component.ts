import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { SkeletonTableComponent } from '../../components/Skeletons/skeleton-table/skeleton-table.component';

@Component({
  selector: 'app-invoice-services',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SkeletonTableComponent],
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
  loading = false;
  alertMessage: string | null = null;
  alertType: 'alert-success' | 'alert-danger' = 'alert-success';

  selectedServiceIds: number[] = [];
  selectAllChecked = false;

  isSubmittingServices: boolean = false; 
  isSubmittingAVP: boolean = false;

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
    this.loading = true;
    this.invoiceService.getServicesByInvoice(this.invoiceId).subscribe({
      next: (res: any) => {
        this.services = res.data || [];
        this.selectedServiceIds = [];
        this.selectAllChecked = false;
        this.updateCalculations();
        this.loading = false;
      },
      error: () => {
        this.showAlert('Failed to fetch services.', 'alert-danger');
        this.loading = false;
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
  if (this.isSubmittingServices) return; // block rapid calls

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

  this.isSubmittingServices = true; // lock

  this.invoiceService.updateServicesBatch(payload).subscribe({
    next: (res: any) => {
      this.showAlert(res.message || 'Services updated successfully.', 'alert-success');
      this.fetchServices();
      setTimeout(() => {
        this.goBack()
        this.isSubmittingServices = false; 
      }, 2000);
    },
    error: (err) => {
      const msg = err?.error?.error || 'Failed to update services';
      this.showAlert(msg, 'alert-danger');
      this.isSubmittingServices = false; // unlock
    },
  });
}

 // Triggered when user checks/unchecks the "Select All"
  toggleSelectAll(event: any): void {
    this.selectAllChecked = event.target.checked;
    this.services.forEach(service => service.selected = this.selectAllChecked);
    this.updateSelectedServiceIds();
  }

  // Triggered on individual row checkbox
  toggleServiceSelection(id: number, selected: boolean): void {
    const serviceIndex = this.selectedServiceIds.indexOf(id);
    if (selected && serviceIndex === -1) {
      this.selectedServiceIds.push(id);
    } else if (!selected && serviceIndex !== -1) {
      this.selectedServiceIds.splice(serviceIndex, 1);
    }
    this.selectAllChecked = this.selectedServiceIds.length === this.services.length;
  }

  // Sync the selected services IDs from the selected checkboxes
  updateSelectedServiceIds(): void {
    this.selectedServiceIds = this.services.filter(service => service.selected).map(service => service.id);
  }
  // Called when user clicks "Generate AVP"
  onTransferAVP(): void {
  if (this.isSubmittingAVP) return; // block rapid calls

  if (this.selectedServiceIds.length === 0) {
    this.showAlert('Please select at least one service.', 'alert-danger');
    return;
  }

  const payload = {
    service_ids: this.selectedServiceIds,
    total_ht: this.totals.TTotal_HT,
    total_tva: this.totals.TTotal_TVA,
    total_ttc: this.totals.TTotal_TTC,
  };

  this.isSubmittingAVP = true; // lock

  this.invoiceService.createPartialCreditInvoice(payload).subscribe({
    next: (res) => {
      this.showAlert('AVP invoice created successfully.', 'alert-success');
       setTimeout(() => {
         this.isSubmittingAVP = false; 
        this.goBack()
      }, 2000);
    },
    error: (err) => {
      this.showAlert(err.error?.error || 'Failed to create AVP invoice.', 'alert-danger');
      this.isSubmittingAVP = false; 
    },
  });
}


  goBack(): void {
    const role = this.authService.getRole();
    this.router.navigate([`/${role}/invoices-dashboard`]);
  }

}
