import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports :[ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  message: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  alertMessage: string = '';
  alertType: string = '';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', this.token);
  }
  
  

  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
  
    if (confirmPassword?.errors && !confirmPassword.errors['passwordMismatch']) {
      return; // Skip if other validation errors exist
    }
  
    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { newPassword, confirmPassword } = this.resetPasswordForm.value; 
      console.log('Form Values:', this.resetPasswordForm.value);  
      
      if (newPassword === confirmPassword) {
        this.authService.resetPassword(this.token, newPassword).subscribe(
          response => {
            this.alertMessage = response.message || 'Your password has been successfully reset';
            this.alertType = 'alert-success';
  
            setTimeout(() => {
              this.dismissAlert();
              this.router.navigate(['/login']);
            }, (500));
          },
          error => {
            this.alertMessage = error.error.error || 'An error occurred. Please try again.';
            this.alertType = 'alert-danger';
          }
        );
      } else {
        this.errorMessage = 'Password confirmation does not match.';
      }
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }       
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}