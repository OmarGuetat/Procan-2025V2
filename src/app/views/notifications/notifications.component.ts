import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-notifications',
  imports:[CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @Output() onViewRequests = new EventEmitter<number>();
  notifications: any[] = [];
  userRole: string | null = null;
  isLoading: boolean = false;
  hasError: boolean = false;
  

  constructor(private notificationService: NotificationService, private router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    this.fetchNotifications();
  }

 fetchNotifications(): void {
  this.isLoading = true;
  this.hasError = false;

  this.notificationService.getNotifications().subscribe({
    next: (response) => {
      this.notifications = response;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Failed to fetch notifications:', err);
      this.isLoading = false;
      this.hasError = true;
    }
  });
}
  viewMyRequests(notification: any): void {
    if (!notification.is_read) {
      this.markAsRead(notification.id);
    }
    this.router.navigate([`/${this.userRole}/requests-user-dashboard`]);
  }
   viewRequests(notification: any): void {
    if (!notification.is_read) {
      this.markAsRead(notification.id);
    }
    this.router.navigate([`/${this.userRole}/requests-user-dashboard`]);
  }

  markAsRead(notificationId: number, event?: Event): void {
    if (event) event.stopPropagation(); // 

    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
    });
   
  }

  deleteNotification(notificationId: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId).subscribe(() => {
      this.notifications = this.notifications.filter(n => n.id !== notificationId);
    });
  }
}