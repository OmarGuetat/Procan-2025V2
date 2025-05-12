import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';

@Component({
  selector: 'app-doughnut-pie-chart',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ChartjsComponent
  ],
  templateUrl: './doughnut-pie-chart.component.html',
  styleUrls: ['./doughnut-pie-chart.component.scss']
})
export class DoughnutPieChartComponent implements OnChanges {
  @Input() chartTitle: string = 'Chart';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() type: 'doughnut' | 'pie' = 'doughnut';
  @Input() colors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'];

  chartData: ChartData<'doughnut' | 'pie'> = { labels: [], datasets: [] };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels'] || changes['data'] || changes['colors']) {
      this.chartData = {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.colors,
        }],
      };
    }
  }
}
