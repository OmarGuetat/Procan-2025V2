import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent {
  @Input() request: any;
  alertMessage: string = '';
  alertType: string = '';
  selectedLeaveId!: number | null;  
  updateForm!: FormGroup;
  attachmentFile!: File | null;
  attachmentError: string = '';


  constructor(private fb: FormBuilder,private leaveService: LeaveService) {}

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.updateForm = this.fb.group({
      start_date: [this.request.start_date, Validators.required],
      end_date: [this.request.end_date, Validators.required],
      leave_days_requested: [this.request.leave_days_requested, [Validators.required, Validators.min(1)]],
      reason: [this.request.reason, Validators.required],
      other_reason: [this.request.other_reason || '', []]
    });
    this.validateDates();
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  openUpdateModal(request: any): void { 
    this.selectedLeaveId = request.id;
    console.log(this.selectedLeaveId);
    this.updateForm.patchValue({
      start_date: request.start_date,
      end_date: request.end_date,
      reason: request.reason,
    });
  
    // Dynamically target the modal based on the request ID
    const updateModal = new bootstrap.Modal(document.getElementById('updateLeaveModal-' + request.id)!);
    updateModal.show();
  }
  
  // Handle Reason Change
  onReasonChange() {
    if (this.updateForm.value.reason === 'other') {
      this.updateForm.controls['other_reason'].setValidators([Validators.required]);
    } else {
      this.updateForm.controls['other_reason'].clearValidators();
    }
    this.updateForm.controls['other_reason'].updateValueAndValidity();
  }

  // Validate Start and End Dates
  validateDates() {
    const start = this.updateForm.value.start_date;
    const end = this.updateForm.value.end_date;

    if (start && end && new Date(end) < new Date(start)) {
      this.updateForm.controls['end_date'].setErrors({ dateInvalid: true });
    } else {
      this.updateForm.controls['end_date'].setErrors(null);
    }
  }

  // Handle File Upload
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        this.attachmentError = 'Invalid file format. Only PDF, JPG, or PNG allowed.';
        this.attachmentFile = null;
      } else if (file.size > 2 * 1024 * 1024) {
        this.attachmentError = 'File size must be less than 2MB.';
        this.attachmentFile = null;
      } else {
        this.attachmentError = '';
        this.attachmentFile = file;
      }
    }
  }

  // Submit Form
  updateLeave() {
    if (this.updateForm.invalid) return;

    const formData = new FormData();
    formData.append('start_date', this.updateForm.value.start_date);
    formData.append('end_date', this.updateForm.value.end_date);
    formData.append('leave_days_requested', this.updateForm.value.leave_days_requested);
    formData.append('reason', this.updateForm.value.reason);

    if (this.updateForm.value.reason === 'other') {
      formData.append('other_reason', this.updateForm.value.other_reason);
    }

    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile);
    }
    console.log(this.selectedLeaveId);
    this.leaveService.updateLeave(Number(this.selectedLeaveId), formData).subscribe(
      response => {
        console.log(this.selectedLeaveId);
        this.alertMessage = response.message || 'Leave Request Updated Successfully!';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
          location.reload();
        }, 500);
      },
      error => {
        if (error.error) {
          const errors = error.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Error Updating Leave Request';
        }
        this.alertType = 'alert-danger';
      }
    );
  }
  openDeleteModal(requestId: number): void {
    console.log(this.request.status)
    this.selectedLeaveId = requestId;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteLeaveModal')!);
    deleteModal.show();
  }
   // Delete Leave Request
   deleteLeave(LeaveId : number): void {
    
    this.leaveService.deleteLeave(LeaveId).subscribe(
      response => {
        this.alertMessage = response.message || 'Leave Request Deleted Successfully!';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
          location.reload();
        }, 500);
      },
      error => {
        if (error.error) {
          const errors = error.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Error Deleting Leave Request';
        }
        this.alertType = 'alert-danger';
      }
    );
  }
  downloadPdf(leaveId: number) {
    this.leaveService.downloadLeavePdf(leaveId).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leave_request_${leaveId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading PDF:', error);
        alert('Failed to download PDF. Please try again.');
      }
    );
  }
}
