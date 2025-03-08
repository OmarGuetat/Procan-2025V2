import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { CommonModule } from '@angular/common';

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
  selectedReason: string = '';
  dateError: string = '';
  alertMessage: string = '';
  alertType: string = '';
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

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {
    this.leaveForm = this.fb.group({
      start_date: [this.getTodayDate(), Validators.required],
      end_date: ['', Validators.required],
      leave_type: ['', Validators.required],
      other_type: ['']
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

  onDateChange() {
    const startDate = this.leaveForm.get('start_date')?.value;
    const endDate = this.leaveForm.get('end_date')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      this.dateError = 'Start date cannot be later than end date.';
    } else {
      this.dateError = '';
    }
  }

  submitLeaveRequest() {
  if (this.leaveForm.invalid) {
    return;
  }

  const formData = new FormData();
  formData.append('start_date', this.leaveForm.value.start_date);
  formData.append('end_date', this.leaveForm.value.end_date);
  formData.append('leave_type', this.leaveForm.value.leave_type);

  if (this.selectedReason === 'other') {
    formData.append('other_type', this.leaveForm.value.other_type);
  }

  this.leaveService.calculateLeaveDays(formData).subscribe(
    response => {
      console.log(response);  // Log the response to inspect its structure
      if (response && response.leave_days) {
        this.leaveDays = response.leave_days;  // Get leave_days from the root of the response
        this.leaveDetails = response;  // The full response can be stored in leaveDetails
        this.step = 2;  // Move to Step 2
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
    const formData = new FormData();
    formData.append('start_date', this.leaveForm.value.start_date);
    formData.append('end_date', this.leaveForm.value.end_date);
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
        this.alertMessage = response.message || 'Leave request submitted successfully';
        this.alertType = 'alert-success';
        this.step = 1;  // Reset to Step 1
        this.leaveForm.reset();
        setTimeout(() => this.dismissAlert(), 2000);
      },
      error => {
        this.alertMessage = error.error?.message || 'Error submitting leave request';
        this.alertType = 'alert-danger';
      }
    );
  }
}
