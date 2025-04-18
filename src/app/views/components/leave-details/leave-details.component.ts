import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';

interface Leave {
  id: number;
  created_at: string;
  leave_day_limit: number;
  description: string;
}

@Component({
  selector: 'app-leave-details',
  imports: [CommonModule],
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
  user: { first_name: string; last_name: string } = { first_name: '', last_name: '' };

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.fetchLeaveData();
  }

  fetchLeaveData(): void {
    this.leaveService.getLeaveDetails(this.userId, this.currentPage).subscribe(response => {
      console.log('Leave Data:', response);
      if (response.user && response.data) {
        this.user = response.user; // Set user data here
        this.leaveData = response.data; // Set leave data
        this.totalPages = response.meta.total_pages;
        this.totalLeaves = response.meta.total_leaves;
      }
    }, error => {
      console.error('Error fetching leave details:', error);
    });
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
    if (this.isSubmitting) return; // Prevent double click
  
    this.isSubmitting = true;
    this.leaveService.cancelLeave(leaveId).subscribe(
      response => {
      console.log("pressed");
      this.alertMessage = response.message || 'Deleted Successfully!';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
          this.isSubmitting = false;
        }, 500);
      this.fetchLeaveData(); 
    }, error => {
      this.alertMessage = error.error?.message || 'Error Deleting';
      this.alertType = 'alert-danger';
      this.isSubmitting = false; 
    });
  }

  // Method to go back to the list
  onBackClick(): void {
    this.backToList.emit();
  }
}
