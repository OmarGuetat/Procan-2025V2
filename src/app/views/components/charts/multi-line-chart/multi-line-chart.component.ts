import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { CardComponent, CardBodyComponent, CardHeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-multi-line-chart',
  standalone: true,
  imports: [CommonModule, ChartjsComponent, CardComponent, CardBodyComponent, CardHeaderComponent],
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.scss']
})
export class MultiLineChartComponent implements OnChanges {
  @Input() chartTitle: string = 'Approved Leaves Comparison';
  @Input() datasets: { year: string; data: number[]; color: string }[] = [];
  @Input() labels: string[] = []; // Months like Jan, Feb, ...

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.lineChartData = {
      labels: this.labels,
      datasets: this.datasets.map((d) => ({
        label: d.year,
        data: d.data,
        borderColor: d.color,
        tension: 0.4,
        fill: false
      }))
    };
  }
}
