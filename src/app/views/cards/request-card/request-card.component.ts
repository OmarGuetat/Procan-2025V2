import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LeaveService } from '../../../services/leave.service';
import { FormsModule, FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-request-card',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,SharedModule],
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss']
})
export class RequestCardComponent {
  @Input() request: any;
  @Input() showMenu: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  selectedLeaveId!: number | null;
  updateForm!: FormGroup;
  attachmentFile!: File | null;
  attachmentError: string = '';
  isSubmitting: boolean = false;
  constructor(private fb: FormBuilder, private leaveService: LeaveService) { }

  ngOnInit() {
    this.initForm();
    // Convert old 'other' type to 'personal_leave'
    if (this.request.leave_type === 'other') {
      this.request.leave_type = 'personal_leave';
    }
  }

  initForm() {
    this.updateForm = this.fb.group({
      leave_type: [this.request.leave_type, Validators.required],
      other_type: [this.request.other_type || '', []]
    });
  }

  dismissAlert() {
    this.alertMessage = '';
  }

  openUpdateModal(request: any): void {
    this.selectedLeaveId = request.id;
    this.updateForm.patchValue({
      leave_type: request.leave_type === 'other' ? 'personal_leave' : request.leave_type,
      other_type: request.other_type || ''
    });

    const updateModal = new bootstrap.Modal(document.getElementById('updateLeaveModal-' + request.id)!);
    updateModal.show();
  }

  onReasonChange() {
    if (this.updateForm.value.leave_type === 'personal_leave') {
      this.updateForm.controls['other_type'].setValidators([Validators.required]);
    } else {
      this.updateForm.controls['other_type'].clearValidators();
    }
    this.updateForm.controls['other_type'].updateValueAndValidity();
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
        timeLabel = '';
    }
    return `${date} ${timeLabel}`;
  }


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

updateLeave() {
  if (this.isSubmitting) return; 
  if (this.updateForm.invalid) return;

  this.isSubmitting = true;

  const formData = new FormData();
  const leaveType = this.updateForm.value.leave_type;
  formData.append('leave_type', leaveType);

  if (leaveType === 'other' && this.updateForm.value.other_type) {
    formData.append('other_type', this.updateForm.value.other_type);
  }

  if (
    ['sick_leave'].includes(leaveType) &&
    this.attachmentFile
  ) {
    formData.append('attachment', this.attachmentFile);
  }

  console.log('Submitting FormData:', this.updateForm.value);
  console.log('Leave Type:', this.updateForm.value.leave_type);

  for (let [key, value] of (formData as any).entries()) {
    console.log(key, value);
  }

  this.leaveService.updateLeave(Number(this.selectedLeaveId), formData).subscribe({
    next: response => {
      this.alertMessage = response.message || 'Leave Request Updated Successfully!';
      this.alertType = 'alert-success';
      setTimeout(() => {
        this.dismissAlert();
        location.reload();
      }, 500);
      this.isSubmitting = false;  // Re-enable submission after success
    },
    error: error => {
      if (error.error) {
        const errors = error.error;
        const firstErrorKey = Object.keys(errors)[0];
        this.alertMessage = errors[firstErrorKey][0];
      } else {
        this.alertMessage = 'Error Updating Leave Request';
      }
      this.alertType = 'alert-danger';
      this.isSubmitting = false; // Re-enable submission after error
    }
  });
}


  openDeleteModal(requestId: number): void {
    this.selectedLeaveId = requestId;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteLeaveModal')!);
    deleteModal.show();
  }

  deleteLeave(LeaveId: number): void {
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
        this.alertMessage = 'Failed to download PDF. Please try again.';
        this.alertType = 'alert-danger';
      }
    );
  }
}