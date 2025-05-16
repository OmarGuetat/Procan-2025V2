import { Component, OnInit } from '@angular/core';
import { AdminHrHomeService } from '../../../services/admin-hr-home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-holiday-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-holiday-widget.component.html',
  styleUrls: ['./dashboard-holiday-widget.component.scss']
})
export class DashboardHolidayWidgetComponent implements OnInit {
  holidays: any[] = [];
  loading = false;
  error = '';

  constructor(private dashboardService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.fetchUpcomingHolidays();
  }

  fetchUpcomingHolidays() {
    this.loading = true;
    this.error = '';
    this.dashboardService.getUpcomingHolidays().subscribe({
      next: (res) => {
        this.holidays = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load holidays';
        this.loading = false;
      }
    });
  }
}
