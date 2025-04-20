import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import {Router } from '@angular/router';

import { 
  ContainerComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderTogglerDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee-service.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [
    ContainerComponent, HeaderTogglerDirective, CommonModule, SidebarToggleDirective, IconDirective,
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, 
    DropdownItemDirective
  ]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  avatarPath: string = '';
  fullName: string = 'User';
  
  notifications: any[] = [];
  unreadCount: number = 0;

  ngOnInit(): void {
    this.loadUserData();
    this.fetchNotifications();

    // ✅ Subscribe to real-time notifications
    this.notificationService.notifications$.subscribe((newNotifications) => {
      console.log('🔔 Real-time notifications received:', newNotifications);

      if (Array.isArray(newNotifications)) {
        this.notifications = [...newNotifications, ...this.notifications];
      } else {
        this.notifications = [newNotifications, ...this.notifications];
      }

      this.updateUnreadCount();
    });
  }

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    super();
  }

  sidebarId = input('sidebar1');

  loadUserData(): void {
      this.employeeService.getData().subscribe(response => {
        this.avatarPath = response.avatar_path || '';
        this.fullName = response.full_name || 'User';
      });
    
    }
  

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('role');
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((response) => {
      this.notifications = response;
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

  showAllNotifications() {
    const role = this.authService.getRole();
    const rolePrefix = this.getRolePrefix(role);
    this.router.navigate([`/${rolePrefix}/notifications`]);
  }
  
  goToProfile() {
    const role = this.authService.getRole();
    const rolePrefix = this.getRolePrefix(role);
    this.router.navigate([`/${rolePrefix}/profile`]);
  }
  
  // Add this helper if it's not already available
  private getRolePrefix(role: string | null): string {
    switch (role) {
      case 'admin': return 'admin';
      case 'employee': return 'employee';
      case 'accountant': return 'accountant';
      case 'hr': return 'hr';
      default: return 'login';
    }
  }
  

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
  }
}
