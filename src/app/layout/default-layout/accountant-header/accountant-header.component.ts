import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { EmployeeService } from '../../../services/employee-service.service';

@Component({
  selector: 'app-accountant-header',
  templateUrl: './accountant-header.component.html',
  styleUrls: ['./accountant-header.component.scss'],
  imports: [ContainerComponent, CommonModule, IconDirective,ContainerComponent, CommonModule, 
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, 
    DropdownItemDirective]
})
export class AccountantHeaderComponent implements OnInit {
  avatarPath: string = '';
    fullName: string = 'User';
    isAdmin: boolean = false;
    notifications: any[] = []; // ✅ Default to an empty array
    unreadCount: number = 0;
    ngOnInit(): void {
      this.loadUserData();
    }
    constructor(private employeeService: EmployeeService, private authService: AuthService, private router: Router, private notificationService: NotificationService) { }
    loadUserData(): void {
      this.employeeService.getData().subscribe(response => {
        this.avatarPath = response.avatar_path || '';
        this.fullName = response.full_name || 'User';
      });
  
    }
    goToHome() {
      this.router.navigate(['/accountant/accountant-home']);
    }
  
    goToDashboard() {
      this.router.navigate(['/accountant/invoices-dashboard']);
    }
    goToClients() {
      this.router.navigate(['/accountant/client-management']);
    }
    logout() {
      this.authService.logout()
    }
    goToProfile() {
      const role = this.authService.getRole();
      const rolePrefix = this.getRolePrefix(role);
      this.router.navigate([`/${rolePrefix}/profile`]);
    }
    
  
    isActiveRoute(route: string): boolean {
      return this.router.url === route;
    }
    private getRolePrefix(role: string | null): string {
      switch (role) {
        case 'admin': return 'admin';
        case 'employee': return 'employee';
        case 'accountant': return 'accountant';
        case 'hr': return 'hr';
        default: return 'login';
      }
    }
  
  }
  