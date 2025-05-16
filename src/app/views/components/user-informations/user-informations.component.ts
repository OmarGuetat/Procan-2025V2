import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { EmployeeHrHomeService } from '../../../services/employee-hr-home.service';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee-service.service';

@Component({
  selector: 'app-user-informations',
  imports:[CommonModule],
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.scss']
})
export class UserInformationsComponent implements OnInit {
  userInfo: any = {};
  leaveBalances: any[] = [];
  totalRemaining: number = 0;
  lastLeaveAddition: { leave_day_limit: number, date: string } | null = null;
  company: string | null = '';
  today: string = new Date().toLocaleDateString();
  isLoading: boolean = true;
  alertMessage: string = '';
  alertType: string = '';
  selectedFile!: File | null;
  leaveTypes = [
    { 
      type: 'personal_leave', 
      label: 'Personal Leave', 
      icon: 'bi-calendar-day', 
      colorClass: 'bg-primary'
    },
    { 
      type: 'sick_leave', 
      label: 'Sick Leave', 
      icon: 'bi-hospital', 
      colorClass: 'bg-success'
    },
    { 
      type: 'paternity_leave', 
      label: 'Paternity Leave', 
      icon: 'bi-person-badge', 
      colorClass: 'bg-orange' // Orange
    },
    { 
      type: 'maternity_leave', 
      label: 'Maternity Leave', 
      icon: 'bi-person-fill', 
      colorClass: 'bg-pink' // Pink
    }
  ];
  constructor(
    private http: HttpClient,
    private employeeHrHomeService: EmployeeHrHomeService,private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getLeaveBalance();
    this.getLastLeaveAddition();
    this.company = localStorage.getItem('company');
  }
  // Dismiss alert message
  dismissAlert() {
    this.alertMessage = '';
  }
  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  
   onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar_path', file);
      
      this.employeeService.updateUserImage(formData).subscribe(
        response => {
          this.alertMessage = response.message || 'Avatar updated successfully!';
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
            this.alertMessage = 'Error updating avatar';
          }
          this.alertType = 'alert-danger';
        } 
      );
    }
  }
  getUserInfo(): void {
    this.employeeHrHomeService.getAuthenticatedUserInfo().subscribe({
      next: (data) => {
        this.userInfo = data;
        this.checkIfAllLoaded();
      },
      error: (err) => console.error('User info error:', err)
    });
  }

  getLeaveBalance(): void {
    this.employeeHrHomeService.getLeaveBalance().subscribe({
      next: (res) => {
        console.log(res)
        this.leaveBalances = res.data || [];
        this.checkIfAllLoaded();
      },
      error: (err) => console.error('Leave balance error:', err)
    });
  }

  getLastLeaveAddition(): void {
    this.employeeHrHomeService.getLastLeaveAddition().subscribe({
      next: (res) => {
        this.lastLeaveAddition = res.data;
        this.checkIfAllLoaded();
      },
      error: (err) => console.error('Last leave addition error:', err)
    });
  }
  
  getLeaveTypeDetails(leaveType: string) {
    const details = this.leaveTypes.find(type => type.type === leaveType);
    if (!details) {
      return {
        colorClass: 'bg-secondary', // Default fallback color
        icon: 'bi-question-circle', // Default fallback icon
        label: 'Unknown Leave' // Default fallback label
      };
    }
    return details;
  }
  private loadedCount = 0;
checkIfAllLoaded() {
  this.loadedCount++;
  if (this.loadedCount === 3) {
    this.isLoading = false;
  }}    
} 
