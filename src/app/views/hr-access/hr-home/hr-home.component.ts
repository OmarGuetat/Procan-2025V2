import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EmployeeHrHomeService } from '../../../services/employee-hr-home.service';
import { StatusChartComponent } from '../../components/charts-stats/status-chart/status-chart.component';
import { CommonModule } from '@angular/common';
import tippy from 'tippy.js';  // Import tippy for tooltips
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import { UserInformationsComponent } from '../../components/user-informations/user-informations.component';
import { AdminStatusChartComponent } from '../../components/charts-stats/admin-status-chart/admin-status-chart.component';
import { LeaveTypeChartComponent } from '../../components/charts-stats/leave-type-chart/leave-type-chart.component';
import { ApprovedLeavesChartComponent } from '../../components/charts-stats/approved-leaves-chart/approved-leaves-chart.component';
import { ApprovedLeavesTrendComponent } from '../../components/charts-stats/approved-leaves-trend/approved-leaves-trend.component';
import { LeaveStatusCardsComponent } from '../../cards/leave-status-cards/leave-status-cards.component';
import { DashboardHolidayWidgetComponent } from '../../cards/dashboard-holiday-widget/dashboard-holiday-widget.component';
import { EmployeeOnHolidayWidgetComponent } from '../../cards/employee-on-holiday-widget/employee-on-holiday-widget.component';


@Component({
  selector: 'app-hr-home',
  imports: [FullCalendarModule, StatusChartComponent, CommonModule, UserInformationsComponent, DashboardHolidayWidgetComponent,AdminStatusChartComponent,
    LeaveTypeChartComponent,ApprovedLeavesChartComponent,ApprovedLeavesTrendComponent,LeaveStatusCardsComponent,DashboardHolidayWidgetComponent,EmployeeOnHolidayWidgetComponent],
  templateUrl: './hr-home.component.html',
  styleUrl: './hr-home.component.scss'
})
export class HrHomeComponent implements OnInit{
   balance = { total: 0, used: 0, remaining: 0 };
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    eventSources: [
      {
        events: (info, successCallback, failureCallback) => {
          this.homeService.getCalendarData().subscribe({
            next: (res) => {
              console.log(res)
              successCallback(res.data); // only one source, no duplicates
            },
            error: (err) => {
              console.error('Failed to load calendar data', err);
              failureCallback(err);
            }
          });
        }
      }
    ],
    eventContent: (arg) => {
      const event = arg.event;
      const startDate = new Date(event.startStr);
      const endDate = new Date(event.endStr);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) ;

      let iconClass = 'bi-calendar-day';
      if (event.title.includes('Personal leave')) iconClass = 'bi-briefcase';
      else if (event.title.includes('Sick leave')) iconClass = 'bi-thermometer-half';
      else if (event.title.includes('Other')) iconClass = 'bi-three-dots';
      else if (event.title.includes('Maternity leave')) iconClass = 'bi-gender-female';
      else if (event.title.includes('Paternity leave')) iconClass = 'bi-gender-male';

      const customEl = document.createElement('div');
      const showDays = !isNaN(days) && days > 1;
      customEl.innerHTML = `
  <i class="bi ${iconClass}" style="margin-right: 5px;"></i>
  ${event.title}${showDays ? ` (${days} days)` : ''}
`;


      return { domNodes: [customEl] };
    },
    eventDidMount: (info) => {
      // Apply color and style
      const color = info.event.extendedProps['color'];
      info.el.style.backgroundColor = color;
      info.el.style.borderRadius = '8px';
      info.el.style.padding = '5px 10px';
      info.el.style.fontSize = '13px';
      info.el.style.color = '#fff';

      // Tooltip
      if (info.event.startStr && info.event.endStr) {
        tippy(info.el, {
          content: `From: ${info.event.startStr} To: ${info.event.endStr}`,
        });
      }
    }

  };

  constructor(private homeService: EmployeeHrHomeService) { }

  ngOnInit(): void {
    this.homeService.getLeaveBalance().subscribe((res) => {
   
      this.balance = res.data;
    });
  }



}
