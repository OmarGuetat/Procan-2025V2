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
     
      leave_type: request.leave_type,
    });
  
    // Dynamically target the modal based on the request ID
    const updateModal = new bootstrap.Modal(document.getElementById('updateLeaveModal-' + request.id)!);
    updateModal.show();
  }
  
  // Handle Reason Change
  onReasonChange() {
    if (this.updateForm.value.leave_type === 'other') {
      this.updateForm.controls['other_type'].setValidators([Validators.required]);
    } else {
      this.updateForm.controls['other_type'].clearValidators();
    }
    this.updateForm.controls['other_type'].updateValueAndValidity();
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
    formData.append('leave_type', this.updateForm.value.leave_type);
  
    // Append 'other_type' only if 'leave_type' is 'other'
    if (this.updateForm.value.leave_type === 'other' && this.updateForm.value.other_type) {
      formData.append('other_type', this.updateForm.value.other_type);
    }
  
    // Append attachment only if 'leave_type' is 'sick_leave' and a file is selected
    if (this.updateForm.value.leave_type === 'sick_leave' && this.attachmentFile) {
      formData.append('attachment', this.attachmentFile);
    }
  
    this.leaveService.updateLeave(Number(this.selectedLeaveId), formData).subscribe(
      response => {
        console.log('Form Data:', Object.fromEntries(formData as any));
        console.log(response);
        this.alertMessage = response.message || 'Leave Request Updated Successfully!';
        this.alertType = 'alert-success';
        setTimeout(() => {
          this.dismissAlert();
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
        this.alertMessage='Failed to download PDF. Please try again.'
        this.alertType = 'alert-danger';
      }
    );
  }
}
