import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { ChartOptions } from 'chart.js';
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
export class DoughnutPieChartComponent implements OnChanges, OnInit {
  @Input() chartTitle: string = 'Chart';
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() type: 'doughnut' | 'pie' = 'doughnut';
  @Input() showInput: boolean = true;
  @Input() colors: string[] = [

    '#288FEB', // Primary Blue (branding)
    '#4CAF50', // Success Green
    '#FFC107', // Warning Yellow
    '#E63946', // Error Red
    '#8E44AD', // Royal Purple (adds variety but elegant)
    '#FF9F40', // Orange (warm and attention-grabbing)
    '#00B8D9'  // Bright Cyan (modern & distinct)
  ];
  @Input() isLoading: boolean = false;
  @Input() imagePath: string = 'assets/no-data-images/stats.svg';
  @Output() monthChange = new EventEmitter<string>();
  chartData: ChartData<'doughnut' | 'pie'> = { labels: [], datasets: [] };
  selectedMonth: string = '';
  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        display: true,
        position: 'right', // 
        align: 'center',
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        cornerRadius: 4,
        usePointStyle: true
      }
    },
    layout: {
      padding: 16
    }
  };
  
  ngOnInit(): void {
    const today = new Date();
    this.selectedMonth = today.toISOString().slice(0, 7);
    this.monthChange.emit(this.selectedMonth);
  }
  
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
  
  onMonthChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedMonth = input.value;
    this.monthChange.emit(this.selectedMonth);
  }
  
}
