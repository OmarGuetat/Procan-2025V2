import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHrHomeService } from '../../../../services/admin-hr-home.service';
import { BarsChartComponent } from '../../charts/bars-chart/bars-chart.component';


@Component({
  selector: 'app-approved-leaves-chart',
  standalone: true,
  imports: [CommonModule, BarsChartComponent],
  templateUrl: './approved-leaves-chart.component.html',
  styleUrls: ['./approved-leaves-chart.component.scss']
})
export class ApprovedLeavesChartComponent implements OnInit {
  labels: string[] = [];
  data: number[] = [];

  constructor(private adminService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.adminService.getApprovedLeavesByEmployee().subscribe({
      next: (res) => {
        const employees = res.approved_leaves_by_employee;
        this.labels = employees.map(e => e.name);
        this.data = employees.map(e => e.total_days);
      },
      error: (err) => console.error('Failed to load approved leaves', err)
    });
  }
}
