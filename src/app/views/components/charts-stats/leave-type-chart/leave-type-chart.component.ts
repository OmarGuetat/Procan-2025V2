import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHrHomeService } from '../../../../services/admin-hr-home.service';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart/doughnut-pie-chart.component';



@Component({
  selector: 'app-leave-type-chart',
  standalone: true,
  imports: [CommonModule, DoughnutPieChartComponent],
  templateUrl: './leave-type-chart.component.html',
  styleUrls: ['./leave-type-chart.component.scss']
})
export class LeaveTypeChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];

  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.adminService.getLeaveTypeDistribution().subscribe({
      next: (res) => {
        console.log(res)
        const typeCounts = res.leave_distribution;
        this.labels = typeCounts.map((item: { leave_type: string }) => item.leave_type);
        this.data = typeCounts.map((item: { percentage: number }) => item.percentage);
      },
      error: (err) => {
        console.error('Failed to fetch leave type distribution', err);
      },
    });
  }
}
