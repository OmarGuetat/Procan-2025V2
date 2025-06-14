import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-leave-card',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './leave-card.component.html',
  styleUrls: ['./leave-card.component.css']
})
export class LeaveCardComponent implements AfterViewInit {
  @Input() leaveEmployee: any;
  @Output() onSeeDetails = new EventEmitter<number>();
  @Output() onViewRequests = new EventEmitter<number>();
  leaveForm: FormGroup;
  alertMessage: string = '';
  alertType: string = '';
  isSubmitting: boolean = false;
  userId: number = 0;
  constructor(private fb: FormBuilder, private leaveService: LeaveService,private router: Router,private authService: AuthService) {
    this.leaveForm = this.fb.group({
      leave_day_limit: ['', [Validators.required, Validators.min(0.25)]],
      description: ['', [Validators.maxLength(255)]]
    });    
  }
    ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
  ngOnInit(){
    this.userId = +localStorage.getItem('userId')!;
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  seeDetails() {
    const role = this.authService.getRole();
    this.router.navigate([`/${role}/leave-balance-details`, this.leaveEmployee.id]);
  }
  viewRequests() {
    const role = this.authService.getRole();
     this.router.navigate([`/${role}/leave-requests`, this.leaveEmployee.id]);
  }
  addLeaveDays() {
    console.log(this.leaveEmployee)
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