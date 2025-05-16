import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent {
  // Form group for leave form
  leaveForm: FormGroup;
  
  // Variables for leave calculation, form state, and alerts
  leaveDays: number = 0;
  userRole: string = '';
  remainingDays: number = 0;
  selectedReason: string = '';
  dateError: string | null = null;
  alertMessage: string = '';
  alertType: string = '';
  showEndTime: boolean = true;
  selectedStartTime: string = '08:00:00';
  selectedEndTime: string = '08:00:00';
  isConfirming: boolean = false;
  isSubmitting: boolean = false;
  alreadyTaken: boolean = false;
  showEndFields = true;
  isSending: boolean = false;
  rejectionMessage: string = '';
  userGender: string = '';
  
  // Initial leave options
  leaveOptions = [
    { value: 'personal_leave', icon: 'bi bi-person', label: 'Personal Leave' },
    { value: 'sick_leave', icon: 'bi bi-thermometer-half', label: 'Sick Leave' },
    { value: 'other', icon: 'bi bi-three-dots', label: 'Other Reason' }
  ];

  // Options for paternity and maternity leave
  private paternityLeaveOption = {
    value: 'paternity_leave',
    icon: 'bi bi-gender-male',
    label: 'Paternity Leave'
  };
  private maternityLeaveOption = {
    value: 'maternity_leave',
    icon: 'bi bi-gender-female',
    label: 'Maternity Leave'
  };

  // All leave options (including dynamic gender-specific options)
  allLeaveOptions = [...this.leaveOptions];
  step: number = 1;
  leaveDetails: any = {};

  constructor(private fb: FormBuilder, private leaveService: LeaveService, private router: Router) {
    // Initializing the form with validations
    this.leaveForm = this.fb.group({
      start_date: [this.getTodayDate(), Validators.required],
      end_date: ['', Validators.required],
      leave_type: ['', Validators.required],
      start_time: [this.selectedStartTime], // Use stored value
      end_time: [this.selectedEndTime], // Use stored value
      other_type: ['']
    });
  }

  ngOnInit() {
    // Check gender and dynamically add paternity/maternity leave
    this.userGender = localStorage.getItem('gender') || '';
    if (this.userGender === 'female') {
      this.leaveOptions.splice(1, 0, this.maternityLeaveOption); // Insert maternity leave after the first option
    } else if (this.userGender === 'male') {
      this.leaveOptions.splice(1, 0, this.paternityLeaveOption); // Insert paternity leave after the first option
    }
  }

  // Step navigation functions
  goBackToStep1(): void {
    this.step = 1;
    this.leaveForm.patchValue({
      start_time: this.selectedStartTime,
      end_time: this.selectedEndTime
    });
    this.alreadyTaken = false;
  }

  // Send rejection message to HR
  sendExplanationToHR() {
    console.log("Sending email to HR...");
    this.isSending = true;
    const startDateTime = `${this.leaveForm.value.start_date} ${this.leaveForm.value.start_time}`;
    const body = {
      start_date: startDateTime,
      leave_type: this.leaveForm.value.leave_type,
      message: this.rejectionMessage  // Use the employee's written message
    };

    this.leaveService.notifyRejectionToHR(body).subscribe({
      next: (res) => {
        this.isSending = false;
        this.alertMessage = 'Message successfully sent to HR.';
        this.alertType = 'alert-success';
        this.rejectionMessage = '';
      },
      error: (err) => {
        this.isSending = false;
        this.alertMessage = 'Error sending message to HR.';
        this.alertType = 'alert-danger';
        console.error(err);
      }
    });
  }

  // Dismiss alert message
  dismissAlert() {
    this.alertMessage = '';
  }

  // Helper function to get today's date in the correct format
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  // Handle leave reason change
  onReasonChange(leave_type: string) {
    this.selectedReason = leave_type;

    if (leave_type !== 'other') {
      this.leaveForm.patchValue({ other_type: '' });
    }

    const hiddenTypes = ['maternity_leave', 'paternity_leave'];
    this.showEndFields = !hiddenTypes.includes(leave_type);

    const endDateControl = this.leaveForm.get('end_date');

    if (!this.showEndFields) {
      this.leaveForm.patchValue({
        end_date: '',
        end_time: '08:00:00'
      });
      endDateControl?.clearValidators();
    } else {
      endDateControl?.setValidators([Validators.required]);
    }

    endDateControl?.updateValueAndValidity();
  }

  // Set start time based on radio selection
  setStartTime(time: string) {
    let timeValue = '08:00:00';
    if (time === 'first') timeValue = '12:00:00';
    if (time === 'second') timeValue = '17:00:00';
    if (time === 'full') timeValue = '08:00:00';
    this.selectedStartTime = timeValue;
    this.leaveForm.patchValue({ start_time: timeValue });
  }

  // Set end time based on radio selection
  setEndTime(time: string) {
    let timeValue = '08:00:00';
    if (time === 'first') timeValue = '12:00:00';
    if (time === 'second') timeValue = '17:00:00';
    if (time === 'full') timeValue = '08:00:00';
    this.selectedEndTime = timeValue;
    this.leaveForm.patchValue({ end_time: timeValue });
  }

  // Validate start and end dates for consistency
  onDateChange() {
    const startDate = this.leaveForm.value.start_date;
    const endDate = this.leaveForm.value.end_date;

    if (startDate && endDate) {
      if (startDate > endDate) {
        this.dateError = 'End date cannot be before start date.';
        this.showEndTime = false;
      } else {
        this.dateError = null;
        this.showEndTime = startDate !== endDate;
      }
    }
  }

  // Format date-time to display in a user-friendly format
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

  // Capitalize and format leave type
  formatLeaveType(leaveType: string): string {
    return leaveType
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }

  // Submit the leave request
  submitLeaveRequest() {
    this.userRole = localStorage.getItem('role') || 'hr';
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    if (this.leaveForm.invalid) return;

    let startDate = `${this.leaveForm.value.start_date} ${this.leaveForm.value.start_time}`;
    let endDate = `${this.leaveForm.value.end_date} ${this.leaveForm.value.end_time}`;

    if (this.leaveForm.value.start_date === this.leaveForm.value.end_date) {
      endDate = `${this.leaveForm.value.end_date} 23:00:00`;
    }

    const formData = new FormData();
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('leave_type', this.leaveForm.value.leave_type);

    if (this.selectedReason === 'other') {
      formData.append('other_type', this.leaveForm.value.other_type);
    }
     // Log formData content
     for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value);
    }
    console.log(formData)
    this.leaveService.calculateLeaveDays(formData).subscribe({
      next: (response) => {
        console.log(response)
        this.isSubmitting = false;
        if (response) {
          this.leaveDays = response.leave_days;
          this.leaveDetails = response;

          this.leaveForm.patchValue({
            start_date: response.start_date.split(' ')[0],
            end_date: response.end_date.split(' ')[0],
            leave_type: response.leave_type,
            other_type: response.other_type || ''
          });

          this.selectedStartTime = response.start_date.split(' ')[1];
          this.selectedEndTime = response.end_date.split(' ')[1];

          this.leaveForm.patchValue({
            start_time: this.selectedStartTime,
            end_time: this.selectedEndTime
          });

          this.alreadyTaken = false;
          this.step = 2;
        } else {
          this.alertMessage = 'Invalid response format';
          this.alertType = 'alert-danger';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error?.error?.message || '';
        if (errorMessage.includes('already taken')) {
          this.alreadyTaken = true;
          this.step = 2;
          return;
        }

        console.error(error);
        this.alertMessage = errorMessage || 'Error calculating leave days';
        this.alertType = 'alert-danger';
      }
    });
  }

  // Handle file attachment for leave request
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.leaveDetails.attachment = file;
    }
  }

  // Check if an attachment is required based on the leave type
  isAttachmentRequired(): boolean {
    return ['sick_leave', 'maternity_leave', 'paternity_leave'].includes(this.leaveForm.value.leave_type);
  }

  confirmLeaveRequest() {
    if (this.isConfirming) return; // Prevent double click

    this.isConfirming = true;
    let startDate = `${this.leaveForm.value.start_date} ${this.leaveForm.value.start_time}`;
  let endDate = `${this.leaveForm.value.end_date} ${this.leaveForm.value.end_time}`;

  // If start and end dates are the same, set end time to 23:00:00
  if (this.leaveForm.value.start_date === this.leaveForm.value.end_date) {
    endDate = `${this.leaveForm.value.end_date} 23:00:00`;
  }

  const formData = new FormData();
  formData.append('start_date', startDate);
  formData.append('end_date', endDate);
  formData.append('leave_type', this.leaveForm.value.leave_type);
  formData.append('leave_days', this.leaveDetails.leave_days.toString());

  if (this.leaveForm.value.leave_type === 'other') {
    formData.append('other_type', this.leaveForm.value.other_type);
  }

  if (this.isAttachmentRequired() && this.leaveDetails.attachment) {
    formData.append('attachment', this.leaveDetails.attachment);
  }


   

    this.leaveService.storeLeaveRequest(formData).subscribe({
      next: (response) => {
        this.step = 3; // Move to Step 3 (confirmation)
      },
      error: (error) => {
        this.alertMessage = error.error?.message || 'Error submitting leave request';
        this.alertType = 'alert-danger';
        this.isConfirming = false;
      },
      complete: () => { }
    });
  }
  // Button to check History after submission
  viewHistory() {
    const userRole = localStorage.getItem('role') ?? 'guest';
    const rolePrefix = userRole.toLowerCase();
  
    this.router.navigate([`/${rolePrefix}/requests-user-dashboard`]);
  }
}
