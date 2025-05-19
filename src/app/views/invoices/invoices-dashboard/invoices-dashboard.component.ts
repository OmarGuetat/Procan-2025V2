import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SkeletonTableComponent } from '../../components/Skeletons/skeleton-table/skeleton-table.component';
import { PaymentStatusChartComponent } from '../../components/charts-stats/payment-status-chart/payment-status-chart.component';
import { InvoiceTypeChartComponent } from '../../components/charts-stats/invoice-type-chart/invoice-type-chart.component';
import { PaymentModeChartComponent } from '../../components/charts-stats/payment-mode-chart/payment-mode-chart.component';


@Component({
  selector: 'app-invoices-dashboard',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SkeletonTableComponent,PaymentStatusChartComponent,InvoiceTypeChartComponent,PaymentModeChartComponent],
  templateUrl: './invoices-dashboard.component.html',
  styleUrl: './invoices-dashboard.component.scss'
})
export class InvoicesDashboardComponent implements OnInit {
  invoices: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  filters = { year: undefined, month: undefined, type: undefined };
  selectedInvoice: any = {};
  updateForm = {
    amount_paid: 0,
    unpaid_amount: 0
  };
  startDate = '';
  endDate = '';
  search = '';
  currentPlaceholder: string = 'Search by Client Name';
  private placeholderIndex: number = 0;
  private placeholderInterval: any;
  sortByPaymentStatus = '';
  historiqueData: any[] = [];
  loadingHistorique = false;
  loading: boolean = true;
  errorOccurred: boolean = false; 
  isSubmittingUpdate: boolean = false;
   alertMessage: string = '';
  alertType: string = '';
  constructor(private fb: FormBuilder,private invoiceService: InvoiceService,private router: Router,private authService: AuthService) {}
  
  ngOnInit() {
    this.getInvoices(); // Initial fetch
     // Change placeholder every second
     this.placeholderInterval = setInterval(() => {
      this.changePlaceholder();
    }, 2500);
  }
 getInvoices(page: number = 1): void {
  this.loading = true;
  this.errorOccurred = false; // reset error state

  this.invoiceService
    .getInvoices(page, this.startDate, this.endDate, this.search, this.sortByPaymentStatus)
    .subscribe({
      next: (res) => {
        this.invoices = res.data;
        this.totalPages = res.meta.last_page;
        this.currentPage = res.meta.current_page;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loading = false;
      },
      error: () => {
        this.errorOccurred = true;
        this.invoices = []; // clear previous data if any
        this.loading = false;
      }
    });
}
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
  changePlaceholder(): void {
    const placeholders = [
      'Search by Client Name',
      'Search by Invoice Number'
    ];
  
    const inputElement = document.querySelector('.input-group input') as HTMLInputElement;
    inputElement.classList.remove('show-placeholder'); // Start slide-out
  
    setTimeout(() => {
      this.currentPlaceholder = placeholders[this.placeholderIndex]; // 
      inputElement.classList.add('show-placeholder'); // Trigger slide-in
  
      // Move to next placeholder
      this.placeholderIndex = (this.placeholderIndex + 1) % placeholders.length;
    }, 300); // Timing matches CSS transition
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  downloadInvoicePdf(invoiceId: number): void {
    this.invoiceService.downloadInvoicePdf(invoiceId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = window.URL.createObjectURL(file);
  
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `invoice_${invoiceId}.pdf`;
        a.click();
  
        window.URL.revokeObjectURL(fileURL);
      },
      error: (error) => {
        console.error('Download failed:', error);
        this.alertMessage = error?.error?.error || 'An error occurred';
        this.alertType = 'alert-danger';
        // You can show a toast or alert here if needed
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.getInvoices();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getInvoices(page);
    }
  }
  prepareUpdate(invoice: any) {
    this.selectedInvoice = invoice;
    this.updateForm.amount_paid = 0; 
  }
  
  submitUpdate() {
  if (this.isSubmittingUpdate) return; // block rapid calls

  this.isSubmittingUpdate = true; // lock

  const payload = {
    amount_paid: this.updateForm.amount_paid
  };

  this.invoiceService.updatePaymentStatus(this.selectedInvoice.id, payload).subscribe({
    next: () => {
      this.getInvoices(this.currentPage); // refresh list
      const modalEl = document.getElementById('updatePaymentModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();

      // reset submission lock after 2 seconds
      setTimeout(() => {
        this.isSubmittingUpdate = false;
      }, 2000);
    },
    error: (err) => {
      this.alertMessage = err?.error?.error || 'An error occurred';
      this.alertType = 'alert-danger';

      // also reset lock here so user can retry after error
      setTimeout(() => {
        this.isSubmittingUpdate = false;
      }, 2000);
    }
  });
}
  
  formatInvoiceType(str: string): string {
  if (!str) return '';
  return str
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

  onViewAll(id: any) {
    const role = this.authService.getRole();
    this.router.navigate([`/${role}/invoices`, id, 'services']);
  }
  onSortByPaymentStatus(value: 'True' | 'False') {
    this.sortByPaymentStatus = value;
    this.onFilterChange(); 
  }

}