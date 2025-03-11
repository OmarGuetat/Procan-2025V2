import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-request-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './request-dashboard.component.html',
  styleUrl: './request-dashboard.component.css'
})
export class RequestDashboardComponent {
  @Input() userId: number | null = null;
  @Output() backToList = new EventEmitter<void>();

  leaveRequests: any[] = [];
  availableYears: number[] = [];
  selectedYear: number | null = null;
  totalLeaveDays: number = 0;
  employeeName: string = "";
  userRole: string | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  alertMessage: string = '';
  alertType: string = '';
  selectedLeave: any = {}; 
  confirmationStatus: string = '';
  leaveToUpdate: any = null;

  constructor(private leaveService: LeaveService, private userService: UserService) {}

  ngOnInit() {
    
    if (this.userId) {
      this.fetchLeaveRequests();
    }
    this.userRole = this.userService.getRole();
  }
  // Open the confirmation modal with the status
  updateLeaveStatus(leaveId: number, status: string): void {
    this.leaveToUpdate = { id: leaveId, status };
    this.confirmationStatus = status === 'approved' ? 'Accept' : 'Reject';
    
    // Show confirmation modal
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
  }

  // Confirm the status change
  confirmLeaveStatusChange(): void {
    if (!this.leaveToUpdate) return;

    const { id, status } = this.leaveToUpdate;

    // Close modal after confirmation
    const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
    confirmationModal.hide();

    // Perform the actual status update
    this.leaveService.updateLeaveStatus(id, status).subscribe(
      response => {
        this.alertMessage = response.message || 'Leave status updated successfully!';
        this.alertType = 'alert-success';

        // Refresh the leave requests list
        setTimeout(() => {
          this.dismissAlert();
          this.fetchLeaveRequests();
        }, 1000);
      },
      error => {
        this.alertMessage = error.error.message || 'Error updating leave status';
        this.alertType = 'alert-danger';
      }
    );
  }

  dismissAlert() {
    this.alertMessage = '';
  }
  fetchLeaveRequests(): void {
    if (this.userId === null) return; 
  
    this.leaveService.getLeaveRequests(this.userId, this.selectedYear ?? undefined, this.currentPage)
      .subscribe((response) => {
        console.log(response)
        this.leaveRequests = response.data;
        this.availableYears = response.available_years;
        this.totalLeaveDays = this.selectedYear ? response.total_leave_days : 0; 
        this.employeeName = response.full_name;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.total_pages;
      }, error => {
        console.error('Error fetching leave details:', error);
      });
  }
  
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchLeaveRequests();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchLeaveRequests();
    }
  }
  
  onYearChange() {
    this.currentPage = 1; 
    this.fetchLeaveRequests();
  }
  // Open the modal and pre-fill with the leave request data
  openUpdateModal(leave: any): void {
    this.selectedLeave = { ...leave }; // Pre-fill the selectedLeave with the leave details
    const updateModal = new bootstrap.Modal(document.getElementById('updateLeaveModal'));
    updateModal.show(); // Show the modal
  }

  // Submit the updated leave request
  submitUpdatedLeave(): void {
    if (!this.selectedLeave.start_date || !this.selectedLeave.end_date || !this.selectedLeave.leave_type || !this.selectedLeave.leave_days_requested) {
      this.alertMessage = 'Please fill in all required fields.';
      this.alertType = 'alert-danger';
      return;
    }

    this.leaveService.updateLeaveAdmin(this.selectedLeave.id, this.selectedLeave).subscribe(
      response => {
        this.alertMessage = response.message || 'Leave updated successfully!';
        this.alertType = 'alert-success';

        // Close the modal after successful update
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateLeaveModal'));
        updateModal.hide();

        setTimeout(() => {
          this.fetchLeaveRequests(); // Refresh the leave requests list
          this.dismissAlert();
        }, 1000);
      },
      error => {
        this.alertMessage = error.error.message || 'Error updating leave request';
        this.alertType = 'alert-danger';
      }
    );
  }
  goBack() {
    this.backToList.emit();
  }
}
