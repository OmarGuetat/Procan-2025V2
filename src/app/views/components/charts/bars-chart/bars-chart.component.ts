import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ChartjsComponent } from '@coreui/angular-chartjs';

@Component({
  selector: 'app-bars-chart',
  standalone: true,
  imports: [CommonModule, ChartjsComponent],
  templateUrl: './bars-chart.component.html',
  styleUrls: ['./bars-chart.component.scss']
})
export class BarsChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() chartTitle: string = 'Bar Chart';

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };

  ngOnChanges(): void {
    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          label: this.chartTitle,
          data: this.data,
          backgroundColor: '#36A2EB',
        }
      ]
    };
  }
}
