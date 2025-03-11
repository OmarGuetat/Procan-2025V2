import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee-service.service';
import { NotificationService } from '../../../services/notification.service';


@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
    imports: [ContainerComponent, HeaderTogglerDirective,CommonModule, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit  {
  avatarPath: string = '';
  fullName: string = 'User';
  isAdmin: boolean = false;
  notifications: any[] = [];
  unreadCount: number = 0;
  ngOnInit(): void {
    this.loadUserData();
    this.fetchNotifications();
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.updateUnreadCount();
    });
  }
  constructor(private authService: AuthService,private employeeService: EmployeeService, private notificationService: NotificationService,private router: Router) {
    super();
  }

  sidebarId = input('sidebar1');
  loadUserData(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.employeeService.getData().subscribe(response => {
        this.avatarPath = response.avatar_path || '';
        this.fullName = response.full_name || 'User';
      });
    } else {
      this.fullName = 'Admin';
      this.isAdmin = true;
    }
  }
  logout(): void {
    this.authService.logout();
    localStorage.removeItem('role');
  }
  
  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((response) => {
      this.notifications = response;
      this.updateUnreadCount();
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      // Optimized state update
      this.notifications = this.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      this.updateUnreadCount();
    });
  }
   // Delete Notification
   deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation(); // Prevents triggering markAsRead

    this.notificationService.deleteNotification(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.unreadCount = this.notifications.filter(n => !n.read_at).length;
      },
      (error) => {
        console.error('Error deleting notification:', error);
      }
    );
  }
  showAllNotifications() {
    this.router.navigate(['/main/notifications']);
    }
    goToProfile() {
      this.router.navigate(['/main/profile']);
      }
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter((n) => !n.is_read).length;
  }
}
