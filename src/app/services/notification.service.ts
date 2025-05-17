import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = environment.apiUrl + '/notifications';
  private pusher!: Pusher;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.initializePusher();
  }

  // Fetch notifications from the backend
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Set initial notifications (when the page is loaded)
  setInitialNotifications(notifications: any[]): void {
    this.notificationsSubject.next(notifications);
  }

  // Mark a notification as read
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }
  // Delete notification
  deleteNotification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  private initializePusher(): void {
    this.pusher = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherAppCluster,
      forceTLS: true,
    });

    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }

    // Subscribe to the user's notifications channel
    const channel = this.pusher.subscribe(`notifications-channel.${userId}`);

    // Handle subscription errors
    channel.bind('pusher:subscription_error', (status: any) => {
      console.error('Pusher subscription error:', status);
    });

    // Listen for new notifications
    channel.bind('new-notification', (data: any) => {
      this.ngZone.run(() => {
        const notification = {
          ...data.notification,
          sender_avatar_path: data.sender_avatar_path, // Including sender's avatar path
        };

        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...currentNotifications]); // Add new notification at the beginning
      });
    });
  }
}
