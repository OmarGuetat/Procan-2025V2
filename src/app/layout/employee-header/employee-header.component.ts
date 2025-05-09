import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContainerComponent, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, HeaderTogglerDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-expediteur-header',
  templateUrl: './expediteur-header.component.html',
  imports: [ContainerComponent, CommonModule, IconDirective,ContainerComponent, CommonModule, 
    DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, 
    DropdownItemDirective]
})
export class ExpediteurHeaderComponent implements OnInit {
  
  fullName: string = 'User';
  isAdmin: boolean = false;
  notifications: any[] = []; // ✅ Default to an empty array
  unreadCount: number = 0;
  ngOnInit(): void {
    
    this.fetchNotifications();

    this.notificationService.notifications$.subscribe((newNotifications) => {
      console.log('🔔 Real-time notifications received:', newNotifications);
    
      if (Array.isArray(newNotifications)) {
        this.notifications = [...newNotifications, ...this.notifications];
      } else if (newNotifications && typeof newNotifications === 'object') {
        this.notifications = [newNotifications, ...this.notifications];
      }
    
      this.updateUnreadCount();
    });
  }
  constructor(private authService: AuthService,private router: Router,private notificationService: NotificationService) {}

  goToHome() {
    this.router.navigate(['/main/expediteur-home']);
  }

  goToRecherche() {
    this.router.navigate(['/main/filter-clients']);
  }
  goToPickups(){
    this.router.navigate(['/main/all-pickups']);
  }
  goToCalculator() {
    // Open calculator
    console.log('Opening Calculator');
  }
  goToNewRequest() {
    this.router.navigate(['/main/demandes-livraison']);
  }
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out');
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
  }
  fetchNotifications(): void {
    this.notificationService.getNotifications().subscribe((response) => {
      console.log('📩 Raw API Response:', response); // Debugging
      
      // Check if response is an object and has 'notifications' key
      if (response && 'notifications' in response && Array.isArray(response.notifications)) {
        this.notifications = response.notifications; // ✅ Correct assignment
      } else {
        this.notifications = []; // Default to empty array if unexpected structure
      }
  
      console.log('✅ Notifications:', this.notifications);
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
    this.router.navigate(['/main/notifications']);
  }
  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.is_read).length;
  }
}
