import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStatusChartComponent } from '../components/admin-status-chart/admin-status-chart.component';
import { LeaveTypeChartComponent } from '../components/leave-type-chart/leave-type-chart.component';
import { ApprovedLeavesChartComponent } from '../components/approved-leaves-chart/approved-leaves-chart.component';
import { ApprovedLeavesTrendComponent } from '../components/approved-leaves-trend/approved-leaves-trend.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    AdminStatusChartComponent,
    LeaveTypeChartComponent,ApprovedLeavesChartComponent,ApprovedLeavesTrendComponent
  ],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent  {

}
