import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AdminHrHomeService } from '../../../services/admin-hr-home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-on-holiday-widget',
  imports: [CommonModule],
  templateUrl: './employee-on-holiday-widget.component.html',
  styleUrl: './employee-on-holiday-widget.component.scss'
})
export class EmployeeOnHolidayWidgetComponent implements AfterViewInit {
  leavesToday: any[] = [];
  loading = true;
  error = '';

  constructor(private dashboardService: AdminHrHomeService
  ) {}
   ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
     tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
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
