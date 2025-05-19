import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee-service.service';
import { CommonModule } from '@angular/common';
import { ProfileSkeletonComponent } from '../components/Skeletons/profile-skeleton/profile-skeleton.component';
@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule,ProfileSkeletonComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  updateProfileForm!: FormGroup;
  selectedFile!: File | null;
  alertMessage: string = '';
  alertType: string = '';
  isAdmin: boolean = false;
  loading: boolean = true;
  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.initializeForm();
    this.loadProfile();
    this.updateProfileForm = this.fb.group({
  email: ['', [Validators.email]],
  phone: ['', [Validators.pattern(/^\d{8}$/)]],
  address: ['']
});

  }

  dismissAlert() {
    this.alertMessage = '';
  }

  loadProfile(): void {
    this.loading = true;
    this.employeeService.getProfileData().subscribe(response => {
      this.profileData = response;
      this.updateProfileForm.patchValue({
        email: response.email,
        phone: response.phone || '',
        address: response.address || ''
      });
      this.loading = false;
    }, error => {
      this.alertMessage = 'Error loading profile data';
      this.alertType = 'alert-danger';
      this.loading = false;
    });
  }
  

  initializeForm(): void {
    this.updateProfileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });
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
  
  
  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.click();
  }
  
  onSubmit(): void {
    if (this.updateProfileForm.invalid) return;
  
    const formData = new FormData();
    formData.append('email', this.updateProfileForm.value.email);
    if (this.updateProfileForm.value.phone) formData.append('phone', this.updateProfileForm.value.phone);
    if (this.updateProfileForm.value.address) formData.append('address', this.updateProfileForm.value.address);
    
    this.employeeService.updateProfile(formData).subscribe(
      response => {
        this.alertMessage = response.message || 'Profile updated successfully!';
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
          this.alertMessage = 'Error updating profile';
        }
        this.alertType = 'alert-danger';
      } 
    );
  }
  
  
  
}