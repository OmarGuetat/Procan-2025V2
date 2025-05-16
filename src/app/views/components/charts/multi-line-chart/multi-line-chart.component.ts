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
  @Input() labels: string[] = [];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#121212', 
          font: {
            family: 'Inter',
            size: 13
          }
        }
      },
      tooltip: {
        backgroundColor: '#202C3C', 
        titleColor: '#FFFFFF',
        bodyColor: '#F3F3F3',
        titleFont: {
          family: 'Inter',
          size: 13
        },
        bodyFont: {
          family: 'Roboto',
          size: 12
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#4A4A4A', 
          font: {
            family: 'Roboto',
            size: 12
          }
        },
        grid: {
          color: '#D1D5DB' 
        }
      },
      y: {
        ticks: {
          color: '#4A4A4A',
          font: {
            family: 'Roboto',
            size: 12
          }
        },
        grid: {
          color: '#D1D5DB'
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.lineChartData = {
      labels: this.labels,
      datasets: this.datasets.map((d) => ({
        label: d.year,
        data: d.data,
        borderColor: d.color,
        backgroundColor: d.color,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: d.color,
        borderWidth: 2
      }))
    };
  }
}
