import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EmployeeHrHomeService } from '../../services/employee-hr-home.service';
import { StatusChartComponent } from '../components/charts-stats/status-chart/status-chart.component';
import { CommonModule } from '@angular/common';
import { LeaveProgressBarComponent } from '../components/leave-progress-bar/leave-progress-bar.component';
import tippy from 'tippy.js';  // Import tippy for tooltips
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

@Component({
  selector: 'app-hr-home',
  imports: [FullCalendarModule, StatusChartComponent, CommonModule, LeaveProgressBarComponent],
  templateUrl: './hr-home.component.html',
  styleUrl: './hr-home.component.scss'
})
export class HrHomeComponent {
  balance = { total: 0, used: 0, remaining: 0 };
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    eventDidMount: (info) => {
      const el = info.el as HTMLElement;
      const event = info.event;
      const startDate = new Date(event.startStr);
      const endDate = new Date(event.endStr);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1; // Calculate the number of leave days

      // Set event colors and icons based on leave type
      switch (true) {
        case event.title.includes('Personal leave'):
          el.style.backgroundColor = '#2196F3'; // Blue for personal leave
          el.innerHTML = `<i class="bi bi-briefcase"></i> ${event.title} (${days} days)`;
          break;
        case event.title.includes('Sick leave'):
          el.style.backgroundColor = '#FF9800'; // Orange for sick leave
          el.innerHTML = `<i class="bi bi-thermometer-half"></i> ${event.title} (${days} days)`;
          break;
        case event.title.includes('Other'):
          el.style.backgroundColor = '#9E9E9E'; // Grey for other leave
          el.innerHTML = `<i class="bi bi-three-dots"></i> ${event.title} (${days} days)`;
          break;
        case event.title.includes('Maternity leave'):
          el.style.backgroundColor = '#E91E63'; // Pink for maternity leave
          el.innerHTML = `<i class="bi bi-gender-female"></i> ${event.title} (${days} days)`;
          break;
        case event.title.includes('Paternity leave'):
          el.style.backgroundColor = '#4CAF50'; // Green for paternity leave
          el.innerHTML = `<i class="bi bi-gender-male"></i> ${event.title} (${days} days)`; // Updated icon
          break;
        default:
          el.style.backgroundColor = '#F4C430'; // Default color for other types
          el.innerHTML = `<i class="bi bi-calendar-day"></i> ${event.title} `;
          break;
      }

      // General styling
      el.style.borderRadius = '8px';
      el.style.padding = '5px 10px';
      el.style.fontSize = '13px';
      el.style.color = '#fff';

      // Tooltip: Show more information when hovering
      if (event.startStr && event.endStr) {
        tippy(el, {
          content: `From: ${event.startStr} To: ${event.endStr}`,
        });
      }
    }
  };

  constructor(private homeService: EmployeeHrHomeService) {}

  ngOnInit(): void {
    this.loadCalendarData();
    this.homeService.getLeaveBalance().subscribe((res) => {
      this.balance = res.data;
    });
  }

  loadCalendarData(): void {
    this.homeService.getCalendarData().subscribe({
      next: (res) => {
        console.log(res);
        this.calendarOptions.events = res.data;
      },
      error: (err) => {
        console.error('Failed to load calendar data', err);
      }
    });
  }
}
