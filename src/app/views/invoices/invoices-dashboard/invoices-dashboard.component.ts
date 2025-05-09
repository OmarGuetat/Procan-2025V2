import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


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
  updateForm!: FormGroup;
  constructor(private fb: FormBuilder,private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.fetchInvoices();
    this.updateForm = this.fb.group({
      type: ['', Validators.required],
      unpaid_amount: [0, Validators.required],
      amount_paid: [0, Validators.required],
      payment_status: ['', Validators.required],
      due_date: ['', Validators.required],
      payment_mode: [''],
      client_id: [null, Validators.required],
      company_id: [null, Validators.required],
      additional_date: [''],
    });
  }

  fetchInvoices(page: number = 1) {
    this.invoiceService.getInvoices({ ...this.filters, page }).subscribe({
      next: (res) => {
        console.log(res)
        this.invoices = res.data;
        this.currentPage = res.meta.current_page;
        this.totalPages = res.meta.last_page;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error('Failed to load invoices:', err);
      },
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.fetchInvoices();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchInvoices(page);
    }
  }
  openUpdateModal(invoice: any): void {
    this.selectedInvoice = invoice;
    this.updateForm = this.fb.group({
      amount_paid: [invoice.amount_paid || '', [Validators.required, Validators.min(0)]],
      payment_status: [invoice.payment_status || '', Validators.required],
      due_date: [invoice.due_date || '', Validators.required],
      payment_mode: [invoice.payment_mode || '', Validators.required],
      additional_date: [invoice.additional_date || ''],
      additional_date_type: [invoice.additional_date_type || ''],
    });
  
    this.updateForm.valueChanges.subscribe(() => {
      const ad = this.updateForm.get('additional_date')?.value;
      const adt = this.updateForm.get('additional_date_type')?.value;
  
      if ((ad && !adt) || (!ad && adt)) {
        this.updateForm.get('additional_date')?.setErrors({ requiredTogether: true });
        this.updateForm.get('additional_date_type')?.setErrors({ requiredTogether: true });
      } else {
        this.updateForm.get('additional_date')?.setErrors(null);
        this.updateForm.get('additional_date_type')?.setErrors(null);
      }
    });
  
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('updateInvoiceModal')!);
    modal.show();
  }
  
  submitUpdate(): void {
    if (this.updateForm.invalid || !this.selectedInvoice) return;
  
    this.invoiceService.updateInvoice(this.selectedInvoice.id, this.updateForm.value).subscribe({
      next: (res) => {
        alert('Invoice updated successfully!');
        this.fetchInvoices(); // Refresh
        bootstrap.Modal.getInstance(document.getElementById('updateInvoiceModal')!)?.hide();
      },
      error: (err) => {
        alert('Update failed!');
        console.error(err);
      },
    });
  }
  
  onViewAll(invoice: any) {
    this.selectedInvoice = invoice;
    const modal = new bootstrap.Modal(document.getElementById('viewAllModal')!);
    modal.show();
  }
  
  viewHistory(item: any) {
    console.log('View history for invoice:', item.invoice.id);
    // Call API or show history modal
  }
  
}