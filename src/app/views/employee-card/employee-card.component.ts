import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee-service.service';



@Component({
  selector: 'app-employee-card',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent {
  @Input() employee: any;
  isFlipped: boolean = false;
  isClicked = false;
  updateForm: FormGroup;
  alertMessage: string = '';
  alertType: string = '';
  userId: number;
  showToastMessage = false; 
  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }
  deleteEmployee() {
    console.log('Delete function here!');
  }
  animateClick() {
    this.isClicked = true;
    setTimeout(() => {
      this.isClicked = false; 
    }, 300);
}
constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
  this.updateForm = this.fb.group({
    company: ['', Validators.required],
    role: ['', Validators.required],
    job_description:['', Validators.required],
  });
  this.userId = +localStorage.getItem('userId')!;
}

// Fill the form when modal opens
ngOnInit(): void {
  this.updateForm.patchValue({
    company: this.employee.company,
    role: this.employee.role,
    job_description:this.employee.job_description
  });
}
dismissAlert() {
  this.alertMessage = '';
}
// Function to show the toast message when HR tries to delete their own record
showToast() {
  this.showToastMessage = true;
  setTimeout(() => {
    this.closeToast();  // Hide the toast after 3 seconds
  }, 3000); // Adjust the timeout as needed
}

// Function to close the toast manually
closeToast() {
  this.showToastMessage = false;
}
submitUpdate() {
  if (this.updateForm.valid) {
    const updatedEmployee = {
      company: this.updateForm.value.company,
      role: this.updateForm.value.role,
      job_description:this.updateForm.value.job_description
    };

    this.employeeService.updateEmployee(this.employee.id, updatedEmployee).subscribe(
      response => {
        this.alertMessage = response.message || 'Employee updated successfully!';
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
          this.alertMessage = 'Error updating employee';
        }
        this.alertType = 'alert-danger';
      }
    );
  }
}
confirmDelete(employeeId: string) {
  this.employeeService.deleteEmployee(employeeId).subscribe(
    response => {
      this.alertMessage = response.message || 'Employee deleted successfully!';
      this.alertType = 'alert-success';

      setTimeout(() => {
        this.dismissAlert();
        location.reload();
      }, (500));
    },
    error => {
      this.alertMessage = error.error.error || 'Error deleting employee';
      this.alertType = 'alert-danger';
    }
  );
}
}