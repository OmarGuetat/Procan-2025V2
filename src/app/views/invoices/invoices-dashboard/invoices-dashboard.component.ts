import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-invoices-dashboard',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
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
  clientName = '';
  sortByPaymentStatus = '';
  historiqueData: any[] = [];
  loadingHistorique = false;

  constructor(private fb: FormBuilder,private invoiceService: InvoiceService,private router: Router,private authService: AuthService) {}
  
  ngOnInit() {
    this.getInvoices(); // Initial fetch
  }
  getInvoices(page: number = 1): void {
    this.invoiceService
      .getInvoices(page, this.startDate, this.endDate, this.clientName, this.sortByPaymentStatus)
      .subscribe(res => {
        console.log(res)
        this.invoices = res.data;
        this.totalPages = res.meta.last_page;
        this.currentPage = res.meta.current_page
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      });
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
        // You can show a toast or alert here if needed
      }
    });
  }
  
  fetchHistorique(invoiceId: number) {
    this.loadingHistorique = true;
    this.invoiceService.getInvoiceHistorique(invoiceId).subscribe({
      next: (res) => {
        console.log(res)
        this.historiqueData = res.data;
        this.loadingHistorique = false;
        // Open the modal using Bootstrap JavaScript API
        const historiqueModal = new bootstrap.Modal(document.getElementById('historiqueModal'));
        historiqueModal.show();
      },
      error: (err) => {
        console.error('Historique Error:', err);
        this.loadingHistorique = false;
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
    this.updateForm.amount_paid = invoice.amount_paid || 0;
    this.updateForm.unpaid_amount = invoice.unpaid_amount || 0;
  }
  
  submitUpdate() {
    const payload = {
      amount_paid: this.updateForm.amount_paid,
      unpaid_amount: this.updateForm.unpaid_amount
    };
  
    this.invoiceService.updatePaymentStatus(this.selectedInvoice.id, payload).subscribe({
      next: () => {
        this.getInvoices(this.currentPage); // refresh list
        const modalEl = document.getElementById('updatePaymentModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      },
      error: (err) => {
        alert(err.error?.error || 'An error occurred.');
      }
    });
  }
  
  onViewAll(id: any) {
    console.log('View history for invoice:', id);
    const role = this.authService.getRole();
    const rolePrefix = this.getRolePrefix(role);
    this.router.navigate([`/${rolePrefix}/invoices`, id, 'services']);
  }
  onSortByPaymentStatus(value: 'True' | 'False') {
    this.sortByPaymentStatus = value;
    this.onFilterChange(); // Triggers the API call with current filters
  }
  
  viewHistory(item: any) {

    console.log('View history for invoice:', item.invoice.id);
    // Call API or show history modal
  }
  private getRolePrefix(role: string | null): string {
    switch (role) {
      case 'admin': return 'admin';
      case 'accountant': return 'accountant';
      default: return 'login';
    }
  }
}