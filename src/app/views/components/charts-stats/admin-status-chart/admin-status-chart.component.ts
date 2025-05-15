import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHrHomeService } from '../../../../services/admin-hr-home.service';
import { DoughnutPieChartComponent } from '../../charts/doughnut-pie-chart/doughnut-pie-chart.component';

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
  colors: string[] = [
    '#4CAF50', // Approved - Green (matches --color-success)
    '#E63946', // Rejected - Red (matches --color-error)
    '#FFC107'  // Pending - Yellow (matches --color-warning)
  ];
  

  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    // Nothing here now — chart will emit initial monthChange on its own
  }

  onMonthChanged(mr: string): void {
    // mr comes in as 'YYYY-MM'; we need 'MM-YYYY'
    const [year, month] = mr.split('-');
    const param = `${month}-${year}`;
    console.log(param)
    this.adminService.getLeaveStatusDistribution(param).subscribe({
      next: res => {
        console.log(res)
        const statusCounts = res.leave_status_distribution;
        this.labels = statusCounts.map((item: any) => item.status);
        this.data   = statusCounts.map((item: any) => item.count);
      },
      error: err => console.error('Failed to fetch status distribution', err),
    });
  }
}
