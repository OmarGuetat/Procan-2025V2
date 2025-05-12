import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart/doughnut-pie-chart.component';
import { InvoiceService } from '../../../../services/invoice.service';

@Component({
  selector: 'app-invoice-type-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './invoice-type-chart.component.html'
})
export class InvoiceTypeChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getInvoiceTypeStats().subscribe({
      next: (response) => {
        const stats = response.data;
        this.labels = stats.map((item: any) => item.type);
        this.data = stats.map((item: any) => item.count);
      },
      error: (err) => {
        console.error('Error loading invoice type stats:', err);
      }
    });
  }
}
