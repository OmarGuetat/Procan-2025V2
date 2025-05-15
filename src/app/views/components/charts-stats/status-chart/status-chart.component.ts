import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart/doughnut-pie-chart.component';
import { EmployeeHrHomeService } from '../../../../services/employee-hr-home.service';



@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './status-chart.component.html',
})
export class StatusChartComponent implements OnInit {
  @Input() title: string = 'Leave Status Distribution';
  @Input() chartType: 'doughnut' | 'pie' = 'pie';
  isLoading: boolean = false;
  labels: string[] = [];
  data: number[] = [];

  constructor(private homeService: EmployeeHrHomeService) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.homeService.getLeaveStatusStats().subscribe({
      next: (response) => {
        const stats = response.data;
        this.labels = Object.keys(stats);
        this.data = Object.values(stats);
        this.isLoading=false;
      },
      error: (err) => {
        console.error('Failed to fetch leave status stats:', err);
        this.isLoading=false;
      }
    });
  }
}