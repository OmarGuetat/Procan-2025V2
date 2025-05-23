import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MultiLineChartComponent } from '../../charts/multi-line-chart/multi-line-chart.component';
import { AdminHrHomeService } from '../../../../services/admin-hr-home.service';


@Component({
  selector: 'app-approved-leaves-trend',
  imports: [CommonModule, MultiLineChartComponent],
  templateUrl: './approved-leaves-trend.component.html',
  styleUrl: './approved-leaves-trend.component.scss'
})
export class ApprovedLeavesTrendComponent implements OnInit {
  datasets: { year: string; data: number[]; color: string }[] = [];
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.adminService.getApprovedLeavesByYear().subscribe({
      next: (res) => {
        console.log(res)
        const colorPalette = ['#9966FF','#288FEB','#FF6384','#FF9F40'];
        this.datasets = res.approved_leave_comparison_by_year.map((item: any, index: number) => ({
          year: item.year,
          data: Object.values(item.monthly_counts),
          color: colorPalette[index % colorPalette.length]
        }));
      },
      error: (err) => {
        console.error('Error loading leave trends by year', err);
      }
    });
  }
}