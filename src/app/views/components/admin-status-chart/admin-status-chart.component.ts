import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHrHomeService } from '../../../services/admin-hr-home.service';
import { DoughnutPieChartComponent } from'../doughnut-pie-chart/doughnut-pie-chart.component';



@Component({
  selector: 'app-admin-status-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './admin-status-chart.component.html',
  styleUrls: ['./admin-status-chart.component.scss']
})
export class AdminStatusChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];

  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.adminService.getLeaveStatusDistribution().subscribe({
      next: (res) => {
        console.log(res)
        const statusCounts = res.leave_status_distribution;
        this.labels = statusCounts.map((item: { status: string }) => item.status);
        this.data = statusCounts.map((item: { count: number }) => item.count);
      },
      error: (err) => {
        console.error('Failed to fetch status distribution', err);
      },
    });
  }
}
