import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-leave-card',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './leave-card.component.html',
  styleUrls: ['./leave-card.component.css']
})
export class LeaveCardComponent {
  @Input() leaveEmployee: any;
  @Output() onSeeDetails = new EventEmitter<number>();
  @Output() onViewRequests = new EventEmitter<number>();
  leaveForm: FormGroup;
  role: string;
  alertMessage: string = '';
  alertType: string = '';
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private leaveService: LeaveService) {
    this.leaveForm = this.fb.group({
      leave_day_limit: ['', [Validators.required, Validators.min(0.25)]],
      description: ['', [Validators.maxLength(255)]]
    });    
    this.role = localStorage.getItem('role')!;
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  seeDetails() {
    this.onSeeDetails.emit(this.leaveEmployee.id); 
  }
  viewRequests() {
    this.onViewRequests.emit(this.leaveEmployee.id);
  }
  addLeaveDays() {
    const modal = new bootstrap.Modal(document.getElementById('leaveModal-' + this.leaveEmployee.id)!);
    modal.show();
  }

  submitLeave() {
    if (this.isSubmitting) return; // Prevent double click
  
    this.isSubmitting = true;
    if (this.leaveForm.invalid) return;

   

    this.leaveService.addLeaveDays(this.leaveEmployee.id, this.leaveForm.value)
      .subscribe({
        next: (response) => {
          console.log("pressed");
          this.alertMessage = response.message || 'Added successfully!';
          this.alertType = 'alert-success';
  
          setTimeout(() => {
            document.getElementById('closeModal-' + this.leaveEmployee.id)?.click();
            this.dismissAlert();
            location.reload();
          }, 1500);
        },
        error: (error) => {
          setTimeout(() => {
            this.dismissAlert();
          }, 1500);
          if (error.error) {
            const errors = error.error; 
            const firstErrorKey = Object.keys(errors)[0]; 
          this.alertMessage = errors[firstErrorKey][0]; 
          } else {
            this.alertMessage = 'An error occurred';
          }
          this.isSubmitting = false;
          this.alertType = 'alert-danger';
        },
        complete: () => {
          setTimeout(() => {
          this.isSubmitting = false;
          
        },3000)
        
        }
        
      });}
}