import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmployeeService } from '../../../services/employee-service.service';
import { LeaveService } from '../../../services/leave.service';


import { CommonModule } from '@angular/common';

import { EmployeeCardComponent } from '../../cards/employee-card/employee-card.component';
import { LeaveCardComponent } from '../../cards/leave-card/leave-card.component';
import { LeaveCardSkeletonComponent } from '../../components/Skeletons/leave-card-skeleton/leave-card-skeleton.component';
import { EmployeeCardSkeletonComponent } from '../../components/Skeletons/employee-card-skeleton/employee-card-skeleton.component';

@Component({
  selector: 'app-list-component',
  imports: [ EmployeeCardComponent, LeaveCardComponent, CommonModule,EmployeeCardSkeletonComponent,LeaveCardSkeletonComponent],
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
  
    if (this.cardType === 'employee') {
      this.employeeService.searchEmployees(query, page).subscribe({
        next: (response) => {
          this.processResponse(response);
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.leaveService.getLeaveEmployees(query, page).subscribe({
        next: (response) => {
          this.processResponse(response);
        },
        error: (err) => {
          console.error('Error fetching leave employees:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
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
