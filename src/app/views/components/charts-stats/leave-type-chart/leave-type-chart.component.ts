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
  isLoading: boolean = false;
  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    // No need to call API here, the child component will emit monthChange on init
  }

  onMonthChanged(month: string): void {
    this.isLoading= true;
    const [year, mo] = month.split('-');
    const param = `${mo}-${year}`; // format MM-YYYY
    this.adminService.getLeaveTypeDistribution(param).subscribe({
      next: (res) => {
        this.isLoading= false;
        const typeCounts = res.leave_distribution;
        this.labels = typeCounts.map((item: { leave_type: string }) => item.leave_type);
        this.data = typeCounts.map((item: { percentage: number }) => item.percentage);
      },
      error: (err) => {
        console.error('Failed to fetch leave type distribution', err);
        this.isLoading= false;
      },
    });
  }
}
