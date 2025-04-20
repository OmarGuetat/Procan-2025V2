import { Component, Input, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestCardComponent } from '../cards/request-card/request-card.component';
import {  SharedModule } from '@coreui/angular';
@Component({
  selector: 'app-requests-user-dashboard',
  imports: [FormsModule, RequestCardComponent, CommonModule,SharedModule],
  templateUrl: './requests-user-dashboard.component.html',
  styleUrls: ['./requests-user-dashboard.component.css']
})
export class RequestsUserDashboardComponent implements OnInit {
  userId: number = +localStorage.getItem('userId')!;
  leaveRequests: any[] = [];
  availableYears: number[] = [];
  selectedYear: number | null = null;
  selectedType: string | null = null;
  selectedStatus: string | null = null;
  leaveTypes: string[] = ['maternity_leave', 'sick_leave', 'paternity_leave', 'personal_leave']; 
  currentPage: number = 1;
  totalPages: number = 1;
  fullname: string = 'User';

  constructor(private leaveRequestService: LeaveService) { }

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    this.leaveRequestService
      .getUserLeaveRequests(
        this.currentPage,
        this.selectedYear ?? undefined,
        this.selectedStatus ?? undefined,
        this.selectedType ?? undefined
      )
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