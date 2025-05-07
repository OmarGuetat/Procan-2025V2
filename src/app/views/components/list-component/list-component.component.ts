import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../../services/employee-service.service';
import { LeaveService } from '../../../services/leave.service';


import { CommonModule } from '@angular/common';

import { RequestDashboardComponent } from '../../request-dashboard/request-dashboard.component';
import { EmployeeCardComponent } from '../../cards/employee-card/employee-card.component';
import { LeaveCardComponent } from '../../cards/leave-card/leave-card.component';
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';
import { LeaveCardSkeletonComponent } from '../../cards/leave-card-skeleton/leave-card-skeleton.component';
import { EmployeeCardSkeletonComponent } from '../../cards/employee-card-skeleton/employee-card-skeleton.component';

@Component({
  selector: 'app-list-component',
  imports: [LeaveDetailsComponent, EmployeeCardComponent, LeaveCardComponent, CommonModule,RequestDashboardComponent,EmployeeCardSkeletonComponent,LeaveCardSkeletonComponent],
  templateUrl: './list-component.component.html',
  styleUrls: ['./list-component.component.css']
})
export class ListComponent implements OnInit, OnChanges {
  @Input() searchQuery: string = '';
  @Input() cardType: 'employee' | 'leave' = 'employee';
  @Output() selectedUserIdChange = new EventEmitter<number | null>();
  @Output() selectedRequestsUserIdChange = new EventEmitter<number | null>();
  selectedUserId: number | null = null;
  selectedRequestsUserId: number | null = null;
  employees: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  totalEmployees: number = 0;
  perPage: number = 6;
  pages: number[] = [];
  loading: boolean = true;


  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService
  ) { }

  ngOnInit(): void {
    this.loadData(this.currentPage);
    console.log(this.selectedRequestsUserId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      this.performSearch();
    }
  }
  
  loadData(page: number, query: string = ''): void {
    this.loading = true;
    const callback = (response: any) => {
      this.processResponse(response);
      this.loading = false;
    };
  
    if (this.cardType === 'employee') {
      this.employeeService.searchEmployees(query, page).subscribe(callback);
    } else {
      this.leaveService.getLeaveEmployees(query, page).subscribe(callback);
    }
  }

  processResponse(response: any): void {
    this.employees = response.data;
    this.currentPage = response.meta.current_page;
    this.totalPages = response.meta.total_pages;
    this.totalEmployees = response.meta.total_employees;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  performSearch(): void {
    this.loadData(1, this.searchQuery);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadData(page, this.searchQuery);
    }
  }
  onSeeDetails(userId: number): void {
    this.selectedUserIdChange.emit(userId);
    this.selectedUserId = userId;
  }
  onViewRequests(userId: number): void {
    this.selectedRequestsUserIdChange.emit(userId);
    this.selectedRequestsUserId = userId;
   
  }
  onBackToList(): void {
    this.selectedUserId = null;
    this.selectedRequestsUserId=null;
    this.selectedUserIdChange.emit(null);
    this.selectedRequestsUserIdChange.emit(null);
  }
}
