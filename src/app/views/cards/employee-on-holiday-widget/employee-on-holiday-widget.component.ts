import { Component, OnInit } from '@angular/core';
import { AdminHrHomeService } from '../../../services/admin-hr-home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-on-holiday-widget',
  imports: [CommonModule],
  templateUrl: './employee-on-holiday-widget.component.html',
  styleUrl: './employee-on-holiday-widget.component.scss'
})
export class EmployeeOnHolidayWidgetComponent {
  leavesToday: any[] = [];
  loading = true;
  error = '';

  constructor(private dashboardService: AdminHrHomeService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getLeavesToday().subscribe({
      next: (res) => {
        this.leavesToday = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load today\'s leaves';
        this.loading = false;
      }
    });
  }
}
