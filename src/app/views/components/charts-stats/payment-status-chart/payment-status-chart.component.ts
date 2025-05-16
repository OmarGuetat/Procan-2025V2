import { Component, OnInit } from '@angular/core';

import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart2/doughnut-pie-chart.component';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../services/invoice.service';

@Component({
  selector: 'app-payment-status-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './payment-status-chart.component.html'
})
export class PaymentStatusChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];
  chartTitle = 'Payment Status Distribution';
  type: 'doughnut' | 'pie' = 'doughnut';
  isLoading: boolean = false;
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.invoiceService.getPaymentStatusStats().subscribe({
      next: (res) => {
        this.isLoading = false;
        const result = res.data;
        this.labels = result.map((item: any) => item.payment_status);
        this.data = result.map((item: any) => item.count);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load payment status stats:', error);
      }
    });
  }
}
