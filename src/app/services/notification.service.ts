import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

  // Mark a notification as read
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {});
  }

  // Delete notification
  deleteNotification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Initialize Pusher
  private initializePusher(): void {
    this.pusher = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherAppCluster
    });

    const channel = this.pusher.subscribe('notifications-channel');
    channel.bind('new-notification', (data: any) => {
      this.ngZone.run(() => {
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([data, ...currentNotifications]);
      });
    });
  }
}
