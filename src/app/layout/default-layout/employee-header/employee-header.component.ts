import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { EmployeeService } from '../../../services/employee-service.service';

@Component({
  selector: 'app-employee-header',
  templateUrl: './employee-header.component.html',
  styleUrls: ['./employee-header.component.scss'],
  imports: [ContainerComponent, CommonModule, IconDirective, ContainerComponent, CommonModule,
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective,
    DropdownItemDirective]
})
export class EmployeeHeaderComponent implements OnInit {
  avatarPath: string = '';
  fullName: string = 'User';
  isAdmin: boolean = false;
  notifications: any[] = []; // ✅ Default to an empty array
  unreadCount: number = 0;
  ngOnInit(): void {
    this.loadUserData();
    this.fetchNotifications();
    // ✅ Subscribe to real-time notifications
    this.notificationService.notifications$.subscribe((newNotifications) => {

      if (Array.isArray(newNotifications)) {
        this.notifications = [...newNotifications, ...this.notifications];
      } else {
        this.notifications = [newNotifications, ...this.notifications];
      }
      this.updateUnreadCount();
    });
  }
  constructor(private employeeService: EmployeeService, private authService: AuthService, private router: Router, private notificationService: NotificationService) { }
  loadUserData(): void {
    this.employeeService.getData().subscribe(response => {
      this.avatarPath = response.avatar_path || '';
      this.fullName = response.full_name || 'User';
    });

  }
  goToHome() {
    this.router.navigate(['/employee/employee-home']);
  }

  goToForm() {
    this.router.navigate(['/employee/leave-form']);
  }
  goToMyRequests() {
    this.router.navigate(['/employee/requests-user-dashboard']);
  }
  logout() {
    this.authService.logout()
  }
  
  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((response) => {
      this.notifications = response;
      const role = this.authService.getRole();
      console.log('📩 Fetched notifications:', response);
      this.updateUnreadCount();
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      this.updateUnreadCount();
    });
  }

  // ✅ Delete Notification
  deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation(); // Prevents triggering markAsRead

    this.notificationService.deleteNotification(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.updateUnreadCount();
      },
      (error) => {
        console.error('❌ Error deleting notification:', error);
      }
    );
  }
  goToProfile() {
    const role = this.authService.getRole();
    const rolePrefix = this.getRolePrefix(role);
    this.router.navigate([`/${rolePrefix}/profile`]);
  }
  

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
  showAllNotifications() {
    this.router.navigate(['/employee/notifications']);
  }
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
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
