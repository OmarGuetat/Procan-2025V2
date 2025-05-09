import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutPieChartComponent } from '../doughnut-pie-chart/doughnut-pie-chart.component';
import { EmployeeHrHomeService } from '../../../services/employee-hr-home.service';



@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './status-chart.component.html',
})
export class StatusChartComponent implements OnInit {
  @Input() title: string = 'Leave Status (Pie)';
  @Input() chartType: 'doughnut' | 'pie' = 'pie';

  labels: string[] = [];
  data: number[] = [];

  constructor(private homeService: EmployeeHrHomeService) {}

  ngOnInit(): void {
    this.homeService.getLeaveStatusStats().subscribe({
      next: (response) => {
        const stats = response.data;
        this.labels = Object.keys(stats);
        this.data = Object.values(stats);
      },
      error: (err) => {
        console.error('Failed to fetch leave status stats:', err);
      }
    });
  }
}