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
  selectedReason: string = '';
  fileToUpload: File | null = null;
  dateError: string = '';
  showNextYearDays: boolean = false;
  fileError: string = '';
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

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {
    this.leaveForm = this.fb.group({
      start_date: [this.getTodayDate(), Validators.required],
      end_date: ['', [Validators.required]],
      leave_days_requested: ['', [Validators.required, Validators.min(0.5)]],
      leave_days_current_year: ['', [Validators.min(0.5)]], 
      leave_days_next_year: ['', [Validators.min(0.5)]], 
      reason: ['', Validators.required],
      other_reason: [''], 
      attachment: [null] 
    });
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  }
  onReasonChange(reason: string) {
    this.selectedReason = reason;
    this.fileError = '';

    if (reason !== 'sick_leave' && reason !== 'other') {
      this.leaveForm.patchValue({ other_reason: '', attachment: null });
      this.fileToUpload = null;
    }
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];

    if (file && allowedTypes.includes(file.type)) {
      this.fileToUpload = file;
      this.leaveForm.patchValue({ attachment: file });
      this.fileError = ''; // Clear error if valid
    } else {
      this.fileError = 'Invalid file type. Only PDF,JPG, and JPEG are allowed.';
      this.leaveForm.patchValue({ attachment: null });
      this.fileToUpload = null;
    }
  }
  onDateChange() {
    const startDate = this.leaveForm.value.start_date ? new Date(this.leaveForm.value.start_date) : null;
    const endDate = this.leaveForm.value.end_date ? new Date(this.leaveForm.value.end_date) : null;
  
    if (startDate && endDate) {
      if (startDate > endDate) {
        this.dateError = 'Start date cannot be later than end date.';
      } else {
        this.dateError = '';
      }
  
      this.showNextYearDays = startDate.getFullYear() !== endDate.getFullYear();
    } else {
      // Reset next year input if end date is not selected yet
      this.showNextYearDays = false;
    }
  }
  
  submitLeaveRequest() {
    if (this.leaveForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('start_date', this.leaveForm.value.start_date);
    formData.append('end_date', this.leaveForm.value.end_date);
    formData.append('leave_days_requested', this.leaveForm.value.leave_days_requested);
    formData.append('leave_days_current_year', this.leaveForm.value.leave_days_requested);
    formData.append('leave_days_next_year', this.leaveForm.value.leave_days_next_year);
    formData.append('effective_leave_days', this.leaveForm.value.leave_days_requested); 
    formData.append('reason', this.leaveForm.value.reason);

    if (this.selectedReason === 'other') {
      formData.append('other_reason', this.leaveForm.value.other_reason);
    }

    if (this.selectedReason === 'sick_leave' && this.fileToUpload) {
      formData.append('attachment', this.fileToUpload);
    }
    console.log(formData);
    this.leaveService.submitLeaveRequest(formData).subscribe(
      response => {
        this.alertMessage = response.message || 'Leave request submitted successfully';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
          location.reload();
        }, (500));
      },
      error => {
        if (error.error) {
          const errors = error.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Error submitting leave request';
        }
        this.alertType = 'alert-danger';
      }
    );
  }
}
