import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-notifications',
  imports:[CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((response) => {
      this.notifications = response;
    });
  }

  viewHistory(notification: any): void {
    if (!notification.is_read) {
      this.markAsRead(notification.id);
    }
    this.router.navigate(['/main/history']);
  }

  markAsRead(notificationId: number, event?: Event): void {
    if (event) event.stopPropagation(); // Prevents unwanted clicks

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