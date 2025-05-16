import { Component, Input, OnInit } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestCardComponent } from '../../cards/request-card/request-card.component';
import { RequestCardSkeletonComponent } from '../../components/Skeletons/request-card-skeleton/request-card-skeleton.component';
import {  SharedModule } from '@coreui/angular';
@Component({
  selector: 'app-requests-user-dashboard',
  imports: [FormsModule, RequestCardComponent, CommonModule,SharedModule,RequestCardSkeletonComponent],
  templateUrl: './requests-user-dashboard.component.html',
  styleUrls: ['./requests-user-dashboard.component.css']
})
export class RequestsUserDashboardComponent implements OnInit {
  userId: number = +localStorage.getItem('userId')!;
  leaveRequests: any[] = [];
  availableYears: number[] = [];
  totalLeaveDays: number = 0;
  totalRejectedTimes: number = 0;
  totalApprovedTimes: number = 0;
  totalOnHoldTimes: number = 0;
  selectedYear: number | null = null;
  selectedType: string | null = null;
  selectedStatus: string | null = null;
  leaveTypes: string[] = ['maternity_leave', 'sick_leave', 'paternity_leave', 'personal_leave']; 
  currentPage: number = 1;
  totalPages: number = 1;
  fullname: string = 'User';
  isLoading: boolean = false;

  constructor(private leaveRequestService: LeaveService) { }

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    this.isLoading = true;
  
    this.leaveRequestService
      .getUserLeaveRequests(
        this.currentPage,
        this.selectedYear ?? undefined,
        this.selectedStatus ?? undefined,
        this.selectedType ?? undefined
      )
      .subscribe({
        next: (response) => {
          this.leaveRequests = response.data;
          this.availableYears = response.available_years;
          this.totalLeaveDays = this.selectedYear ? response.stats.total_effective_days : 0;
          this.totalRejectedTimes = this.selectedYear ? response.stats.status_counts.approved : 0;
          this.totalApprovedTimes = this.selectedYear ? response.stats.status_counts.rejected : 0;
          this.totalOnHoldTimes = this.selectedYear ? response.stats.status_counts.on_hold : 0;
          this.totalPages = response.meta.total_pages;
          this.isLoading = false;
        },
        error: () => {
          this.leaveRequests = [];
          this.isLoading = false;
        }
      });
  }
  
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) { 
      this.currentPage = page;
      this.fetchLeaveRequests();
    }
  }
  onLeaveTypeChange(): void {
    this.currentPage = 1;
    this.fetchLeaveRequests();
  }
  
  onStatusChange(): void {
    this.currentPage = 1;
    this.fetchLeaveRequests();
  }
  
  formatLeaveType(type: string): string {
    return type.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
  
  onYearChange(): void {
    this.currentPage = 1;
    this.fetchLeaveRequests();
  }

  isCurrentYear(dateString: string): boolean {
    const requestDate = new Date(dateString);
    const currentYear = new Date().getFullYear();
    return requestDate.getFullYear() === currentYear;
  }
}