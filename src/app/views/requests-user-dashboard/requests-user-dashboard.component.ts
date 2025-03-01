import { Component, Input, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { FormsModule } from '@angular/forms';
import { RequestCardComponent } from '../request-card/request-card.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-requests-user-dashboard',
  imports :[FormsModule,RequestCardComponent,CommonModule],
  templateUrl: './requests-user-dashboard.component.html',
  styleUrls: ['./requests-user-dashboard.component.css']
})
export class RequestsUserDashboardComponent implements OnInit {
  userId: number = +localStorage.getItem('userId')!;
  
  leaveRequests: any[] = [];
  availableYears: number[] = [];
  selectedYear: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  fullname:string='User';

  constructor(private leaveRequestService: LeaveService) {}

  ngOnInit(): void {
    
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    this.leaveRequestService.getUserLeaveRequests(this.userId, this.currentPage, this.selectedYear ?? undefined)
      .subscribe(response => {
        this.leaveRequests = response.data;
        this.availableYears = response.available_years;
        this.totalPages = response.meta.total_pages;
      });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchLeaveRequests();
    }
  }

  onYearChange(): void {
    this.currentPage = 1;
    this.fetchLeaveRequests();
  }
}
