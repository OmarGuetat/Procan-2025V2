import { Component, OnInit } from '@angular/core';

import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart/doughnut-pie-chart.component';
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

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getPaymentStatusStats().subscribe((res) => {
      const result = res.data;
      this.labels = result.map((item: any) => item.payment_status);
      this.data = result.map((item: any) => item.count);
    });
  }
}
