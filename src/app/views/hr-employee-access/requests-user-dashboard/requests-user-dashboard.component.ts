import { Component, Input, OnInit } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestCardComponent } from '../../cards/request-card/request-card.component';
import { RequestCardSkeletonComponent } from '../../components/Skeletons/request-card-skeleton/request-card-skeleton.component';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-requests-user-dashboard',
  imports: [ RequestCardComponent,SharedModule,RequestCardSkeletonComponent],
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
  pages: number[] = [];  // Holds the visible page numbers
paginationStart: number = 1;
paginationSize: number = 3;


  constructor(private leaveRequestService: LeaveService) { }

  ngOnInit(): void {
    this.fetchLeaveRequests();
  }
  updatePaginationWindow(): void {
  this.pages = [];

  const end = Math.min(this.paginationStart + this.paginationSize - 1, this.totalPages);
  for (let i = this.paginationStart; i <= end; i++) {
    this.pages.push(i);
  }
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
          this.updatePaginationWindow(); 
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

    // Slide window only if clicked on the last page of the window
    if (page === this.paginationStart + this.paginationSize - 1 && page < this.totalPages) {
      this.paginationStart += 1;
    }
    // Slide window back if clicked on the first page of the window and not on first page globally
    else if (page === this.paginationStart && page > 1) {
      this.paginationStart -= 1;
    }

    this.updatePaginationWindow();
    this.fetchLeaveRequests();
  }
}

  goToNextWindow(): void {
  const nextPage = this.currentPage + 1;
  if (nextPage <= this.totalPages) {
    this.changePage(nextPage);
  }
}

goToPreviousWindow(): void {
  const prevPage = this.currentPage - 1;
  if (prevPage >= 1) {
    this.changePage(prevPage);
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