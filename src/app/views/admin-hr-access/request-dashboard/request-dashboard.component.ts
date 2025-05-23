import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { AuthService } from '../../../services/auth.service';
import { SkeletonTableComponent } from '../../components/Skeletons/skeleton-table/skeleton-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared.module';



@Component({
  selector: 'app-request-dashboard',
  imports: [ FormsModule,SkeletonTableComponent,SharedModule],
  templateUrl: './request-dashboard.component.html',
  styleUrl: './request-dashboard.component.css'
})
export class RequestDashboardComponent {
  
  @Output() backToList = new EventEmitter<void>();
  
  leaveRequests: any[] = [];
  availableYears: number[] = [];
  selectedYear: number | null = null;
  selectedType: string | null = null;
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
  selectedStatus: string | null = null;
  totalRequestedLeaveDays: number = 0;
  totalEffectiveLeaveDays: number = 0;
  isLoading: boolean = false;
  isFirstLoading: boolean = false;
  leaveTypes: string[] = ['paternity_leave', 'maternity_leave', 'sick_leave', 'personal_leave'];
  hasError: boolean = false;
  userId: number | null = null;
  constructor(private leaveService: LeaveService, private authService: AuthService,private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {

    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? +idParam : null;
    if (this.userId) {
      this.fetchLeaveRequests(true);
    }
    this.userRole = this.authService.getRole();
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
  onStatusChange() {
    this.currentPage = 1;
    this.fetchLeaveRequests(); 
  }
  
  dismissAlert() {
    this.alertMessage = '';
  }
 fetchLeaveRequests(isFirstLoad: boolean = false): void {
  if (this.userId === null) return;

  if (isFirstLoad) this.isFirstLoading = true;
  this.isLoading = true;
  this.hasError = false;

  this.leaveService.getLeaveRequests(
    this.userId,
    this.selectedYear ?? undefined,
    this.currentPage,
    this.selectedType ?? undefined,
    this.selectedStatus ?? undefined
  ).subscribe(
    (response) => {
      this.leaveRequests = response.data;
      this.availableYears = response.available_years;
      this.totalLeaveDays = this.selectedYear ? response.total_leave_days : 0;
      this.totalRequestedLeaveDays = response.total_requested_leave_days;
      this.totalEffectiveLeaveDays = response.total_effective_leave_days;
      this.employeeName = response.full_name;
      this.currentPage = response.meta.current_page;
      this.totalPages = response.meta.total_pages;
      this.isLoading = false;
      if (isFirstLoad) this.isFirstLoading = false;
    },
    error => {
      console.error('Error fetching leave details:', error);
      this.isLoading = false;
      this.hasError = true;
      if (isFirstLoad) this.isFirstLoading = false;
    }
  );
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
  onLeaveTypeChange(): void {
    this.currentPage = 1; // Reset to the first page
    this.fetchLeaveRequests(); // Fetch leave requests based on the new leave type
  }
  formatDateTime(datetime: string): string {
    if (!datetime) return '';

    const [date, time] = datetime.split(' ');

    let timeLabel = '';
    switch (time) {
      case '08:00:00':
        timeLabel = 'Full Day';
        break;
      case '12:00:00':
        timeLabel = '1st Half';
        break;
      case '17:00:00':
        timeLabel = '2nd Half';
        break;
      default:
        timeLabel = ''; // fallback if unknown
    }

    return `${date} ${timeLabel}`;
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
    const role = this.authService.getRole();
     this.router.navigate([`/${role}/leave-dashboard`]);
  }
}
