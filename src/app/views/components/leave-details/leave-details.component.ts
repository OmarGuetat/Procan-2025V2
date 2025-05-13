import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';
import { SkeletonTableCardComponent } from '../Skeletons/skeleton-table-card/skeleton-table-card.component';

interface Leave {
  id: number;
  created_at: string;
  leave_day_limit: number;
  description: string;
}

@Component({
  selector: 'app-leave-details',
  imports: [CommonModule,SkeletonTableCardComponent],
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css']
})
export class LeaveDetailsComponent implements OnInit {
  @Input() userId!: number; 
  @Output() backToList = new EventEmitter<void>(); 
  leaveData: Leave[] = []; 
  currentPage: number = 1; 
  totalPages: number = 1; 
  totalLeaves: number = 0; 
  alertMessage: string = '';
  alertType: string = '';
  isSubmitting: boolean = false;
  perPage: number = 10; 
  totalLeaveDayLimit: number = 0;
  user: { first_name: string; last_name: string } = { first_name: '', last_name: '' };
  loading: boolean = false;
  cancelingId: number | null = null; 
  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.fetchLeaveData();
  }
  fetchLeaveData(): void {
    this.loading = true;
    this.leaveService.getLeaveDetails(this.userId, this.currentPage).subscribe(
      response => {
        if (response.user && response.data) {
          this.user = response.user;
          this.leaveData = response.data;
          this.totalPages = response.meta.total_pages;
          this.totalLeaves = response.meta.total_leaves;
          this.totalLeaveDayLimit = response.total_leave_day_limit;
  
          if (this.leaveData.length === 0 && this.currentPage > 1) {
            this.currentPage--;
            this.fetchLeaveData(); // recall fetch for previous page
            return;
          }
        }
        this.loading = false;
      },
      error => {
        console.error('Error fetching leave details:', error);
        this.loading = false;
      }
    );
  }
  
  // Method to go to the next page
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchLeaveData();
    }
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  // Method to go to the previous page
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchLeaveData();
    }
  }

  // Method to go to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchLeaveData();
    }
  }
  cancelLeave(leaveId: number): void {
    if (this.cancelingId !== null) return;
  
    this.cancelingId = leaveId;
    this.leaveService.cancelLeave(leaveId).subscribe(
      response => {
        this.alertMessage = response.message || 'Deleted Successfully!';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
        }, 500);
        this.cancelingId = null;
        this.fetchLeaveData();
      },
      error => {
        this.alertMessage = error.error?.message || 'Error Deleting';
        this.alertType = 'alert-danger';
        this.cancelingId = null;
      }
    );
  }

  // Method to go back to the list
  onBackClick(): void {
    this.backToList.emit();
  }
}
