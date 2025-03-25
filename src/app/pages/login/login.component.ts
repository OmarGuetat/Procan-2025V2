import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent,  InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ForgotPasswordComponent } from '../../views/components/forgot-password/forgot-password.component';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,ForgotPasswordComponent,ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent,  InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectUser();
    }
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(event?: Event) {
  event?.preventDefault();
  this.errorMessage = ''; // Reset the error message before login attempt

  if (this.loginForm.valid) {
    const { name, password } = this.loginForm.value;

    this.authService.login(name, password).subscribe(
      (response) => {
        this.authService.saveToken(response.access_token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.id);
        setTimeout(() => this.redirectUser(), 100);
      },
      (error) => {
        this.errorMessage = error.error.error || 'Invalid username or password'; 
        setTimeout(() => {
          this.errorMessage='';
        }, 4000);
      }
    );
  }
}
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}
// Function to dismiss alert manually
dismissAlert() {
  this.errorMessage = '';
}
redirectUser() {
  const role = localStorage.getItem('role');
  if (role === 'admin') {
    this.router.navigate(['/main/admin-home']);
  } else if (role === 'hr') {
    this.router.navigate(['/main/hr-home']);
  } else if (role === 'employee') {
    this.router.navigate(['/main/employee-home']);
  } else {
    this.router.navigate(['/login']);
  }
}
  getUserRole(): string {
    return localStorage.getItem('userRole') || 'guest';
  }
  
  isForgotPasswordMode = false;

  toggleForgotPassword() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
  }
  
}
