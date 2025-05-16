import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart2/doughnut-pie-chart.component';
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
  isLoading: boolean = false;
  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.isLoading= true;
    this.invoiceService.getInvoiceTypeStats().subscribe({
      next: (response) => {
        this.isLoading= false;
        const stats = response.data;
        this.labels = stats.map((item: any) => item.type);
        this.data = stats.map((item: any) => item.count);
      },
      error: (err) => {
        console.error('Error loading invoice type stats:', err);
        this.isLoading= false;
      }
    });
  }
}
