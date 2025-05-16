import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart2/doughnut-pie-chart.component';
import { InvoiceService } from '../../../../services/invoice.service';

@Component({
  selector: 'app-payment-mode-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './payment-mode-chart.component.html'
})
export class PaymentModeChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];
  colors: string[] = [
    '#6f42c1', // Purple
    '#20c997', // Teal
    '#fd7e14', // Orange
    '#6610f2', // Indigo
    '#e83e8c', // Pink
    '#17a2b8', // Cyan
    '#ffc107'  // Yellow
  ];
  isLoading: boolean = false;
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.isLoading= true;
    this.invoiceService.getPaymentModeStats().subscribe({
      next: (response) => {
        const stats = response.data;
        this.labels = stats.map((item: any) => item.payment_mode);
        this.data = stats.map((item: any) => item.count);
        this.isLoading= false;
      },
      error: (err) => {
        console.error('Error loading payment mode stats:', err);
        this.isLoading= false;
      }
    });
  }
}
