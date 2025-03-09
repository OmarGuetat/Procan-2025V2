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
  selectedLeave: any = null; // Holds the selected leave for updating

  constructor(private leaveService: LeaveService, private userService: UserService) {}

  ngOnInit() {
    
    if (this.userId) {
      this.fetchLeaveRequests();
    }
    this.userRole = this.userService.getRole();
  }
  updateLeaveStatus(leaveId: number, status: string) {
    console.log('Updating leave with ID:', leaveId, 'to status:', status);
    if (!confirm(`Are you sure you want to mark this leave as ${status.toUpperCase()}?`)) {
      return;
    }
  
    this.leaveService.updateLeaveStatus(leaveId, status).subscribe(
      response => {
        this.alertMessage = response.message || 'Leave status updated successfully!';
        this.alertType = 'alert-success';

        setTimeout(() => {
          this.dismissAlert();
          this.fetchLeaveRequests();
        }, 1000);
      },
      error => {
        if (error.error) {
          const errors = error.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Error updating leave status';
        }
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

  // Open Update Modal
  openUpdateModal(leave: any) {
    this.selectedLeave = { ...leave }; 
  }

  // Update Leave Request
  updateLeave() {
    if (!this.selectedLeave) return;
  
    const leaveData = new FormData();
    leaveData.append('start_date', this.selectedLeave.start_date);
    leaveData.append('end_date', this.selectedLeave.end_date);
    leaveData.append('leave_type', this.selectedLeave.leave_type);
    if (this.selectedLeave.other_reason) {
      leaveData.append('other_reason', this.selectedLeave.other_reason);
    }
    leaveData.append('leave_days_requested', this.selectedLeave.leave_days_requested.toString());
    leaveData.append('effective_leave_days', this.selectedLeave.effective_leave_days?.toString() || '0');
  
    this.leaveService.updateLeave(this.selectedLeave.id, leaveData).subscribe(
      (response) => {
        alert(response.message);
        this.fetchLeaveRequests(); // Refresh data
        this.selectedLeave = null; // Close modal
      },
      (error) => {
        alert('Error updating leave: ' + error.error.message);
      }
    );
  }
  
  goBack() {
    this.backToList.emit();
  }
}
