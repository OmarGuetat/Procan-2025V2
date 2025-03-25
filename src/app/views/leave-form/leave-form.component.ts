import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent {
  leaveForm: FormGroup;
  leaveDays: number = 0;
  remainingDays: number = 0;
  selectedReason: string = '';
  dateError: string | null = null;
  alertMessage: string = '';
  alertType: string = '';
  showEndTime: boolean = true; 
  selectedStartTime: string = '08:00:00';
  selectedEndTime: string = '08:00:00';
  leaveOptions = [
    { value: 'vacation', icon: 'bi bi-sun', label: 'Vacation' },
    { value: 'travel_leave', icon: 'bi bi-airplane', label: 'Travel' },
    { value: 'maternity_leave', icon: 'bi bi-gender-female', label: 'Maternity Leave' },
    { value: 'paternity_leave', icon: 'bi bi-gender-male', label: 'Paternity Leave' },
    { value: 'sick_leave', icon: 'bi bi-thermometer-half', label: 'Sick Leave' },
    { value: 'other', icon: 'bi bi-three-dots', label: 'Other' }
  ];
  step: number = 1;
  leaveDetails: any = {};

  constructor(private fb: FormBuilder, private leaveService: LeaveService,private router: Router) {
    this.leaveForm = this.fb.group({
      start_date: [this.getTodayDate(), Validators.required],
      end_date: ['', Validators.required],
      leave_type: ['', Validators.required],
      start_time: [this.selectedStartTime], // Use stored value
      end_time: [this.selectedEndTime], // Use stored value
      other_type: ['']
    });
  }
   
  goBackToStep1(): void {
    this.step = 1;
    this.leaveForm.patchValue({
      start_time: this.selectedStartTime,
      end_time: this.selectedEndTime
    });
  }
  
  dismissAlert() {
    this.alertMessage = '';
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onReasonChange(leave_type: string) {
    this.selectedReason = leave_type;
    if (leave_type !== 'other') {
      this.leaveForm.patchValue({ other_type: '' });
    }
  }

  // Set start time based on radio selection
  setStartTime(time: string) {
    let timeValue = '08:00:00';
    if (time === 'first') timeValue = '12:00:00';
    if (time === 'second') timeValue = '17:00:00';
    if (time === 'full') timeValue = '08:00:00'; // Full day option sets start time
    this.selectedStartTime = timeValue; 
    this.leaveForm.patchValue({ start_time: timeValue }); // Update start_time form control
  }

  // Set end time based on radio selection
  setEndTime(time: string) {
    let timeValue = '08:00:00';
    if (time === 'first') timeValue = '12:00:00';
    if (time === 'second') timeValue = '17:00:00';
    if (time === 'full') timeValue = '08:00:00'; // Full day option sets end time
    this.selectedEndTime = timeValue; 
    this.leaveForm.patchValue({ end_time: timeValue }); // Update end_time form control
  }

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
  
  submitLeaveRequest() {
    if (this.leaveForm.invalid) {
      return;
    }
    // Ensure start_date and end_date include time (combine separately)
    let startDate = `${this.leaveForm.value.start_date} ${this.leaveForm.value.start_time}`;
    let endDate = `${this.leaveForm.value.end_date} ${this.leaveForm.value.end_time}`;
    // Check if the start and end dates are the same
    if (this.leaveForm.value.start_date === this.leaveForm.value.end_date) {
      // If they are the same, set the end time to 23:00:00
      endDate = `${this.leaveForm.value.end_date} 23:00:00`;
    }
    const formData = new FormData();
    formData.append('start_date', startDate); // Send combined date and time
    formData.append('end_date', endDate);     // Send combined date and time
    formData.append('leave_type', this.leaveForm.value.leave_type);
  
    if (this.selectedReason === 'other') {
      formData.append('other_type', this.leaveForm.value.other_type);
    }
  
    this.leaveService.calculateLeaveDays(formData).subscribe(
      response => {
        console.log(response);
        if (response && response.leave_days) {
          this.leaveDays = response.leave_days;
          this.leaveDetails = response;
          this.remainingDays = response.remaining_days;
          this.step = 2;
        } else {
          this.alertMessage = 'Invalid response format';
          this.alertType = 'alert-danger';
        }
      },
      error => {
        console.error(error);
        this.alertMessage = error.error?.message || 'Error calculating leave days';
        this.alertType = 'alert-danger';
      }
    );
  }
  
 onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.leaveDetails.attachment = file;
    }
  }

  confirmLeaveRequest() {
    let startDate = `${this.leaveForm.value.start_date} ${this.leaveForm.value.start_time}`; // Combine date and time for start
    let endDate = `${this.leaveForm.value.end_date} ${this.leaveForm.value.end_time}`; // Combine date and time for end
    // Check if the start and end dates are the same
      if (this.leaveForm.value.start_date === this.leaveForm.value.end_date) {
        // If they are the same, set the end time to 23:00:00
        endDate = `${this.leaveForm.value.end_date} 23:00:00`;
      }
    const formData = new FormData();
    formData.append('start_date', startDate);  // Use combined start date and time
    formData.append('end_date', endDate);      // Use combined end date and time
    formData.append('leave_type', this.leaveForm.value.leave_type);
    formData.append('leave_days', this.leaveDetails.leave_days.toString());
  
    if (this.selectedReason === 'other') {
      formData.append('other_type', this.leaveForm.value.other_type);
    }
  
    if (this.leaveDetails.leave_type === 'sick_leave' && this.leaveDetails.attachment) {
      formData.append('attachment', this.leaveDetails.attachment);
    }
  
    this.leaveService.storeLeaveRequest(formData).subscribe(
      response => {
        this.step = 3; // Move to Step 3 (confirmation)
      },
      error => {
        this.alertMessage = error.error?.message || 'Error submitting leave request';
        this.alertType = 'alert-danger';
      }
    );
  }
  
  
  // Placeholder function for future history navigation logic
  viewHistory() {
  this.router.navigate(['/main/requests-user-dashboard']);
  }
  
}
