import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Pusher from 'pusher-js';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private apiUrl = environment.apiUrl + '/notifications';
  private pusherClient: Pusher;
  private channel: any;

  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private readonly onDestroy$ = new Subject<void>(); // To handle unsubscription

  constructor(private http: HttpClient) {
    // Initialize Pusher with credentials from environment.ts
    this.pusherClient = new Pusher(environment.pusherAppKey, {
      cluster: environment.pusherAppCluster,
      forceTLS: true
    });

    // Call the backend to authenticate and subscribe to the private channel
    this.authenticateAndSubscribe();
  }

  // Authenticate and subscribe to a private Pusher channel
  private authenticateAndSubscribe(): void {
    // Assuming you have the user ID stored locally (e.g., in localStorage)
    const userId = localStorage.getItem('userId'); 

    // Send a request to the backend to authenticate the user for the private channel
    this.http.post<any>(`${environment.apiUrl}/pusher/auth`, { user_id: userId })
      .pipe(
        catchError(error => {
          console.error('Error during Pusher authentication', error);
          throw error;
        })
      )
      .subscribe(response => {
        // Use the returned authentication data to subscribe to the private channel
        this.channel = this.pusherClient.subscribe(response.channel_name);

        // Bind to events once the channel is subscribed
        this.channel.bind('new-notification', (data: any) => {
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([data.notification, ...currentNotifications]);
        });

        console.log('Successfully subscribed to notifications channel');
      });
  }

  // Get notifications from the backend
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching notifications', error);
        throw error;  // You can also handle the error here and return a fallback value
      })
    );
  }

  // Mark a notification as read
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      catchError(error => {
        console.error('Error marking notification as read', error);
        throw error;
      })
    );
  }
  // Delete notification
  deleteNotification(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  // Get unread notifications count
  getUnreadCount(): Observable<{ unread_count: number }> {
    return this.http.get<{ unread_count: number }>(`${this.apiUrl}/unread-count`).pipe(
      catchError(error => {
        console.error('Error fetching unread count', error);
        throw error;
      })
    );
  }

  // Cleanup Pusher subscription on destroy
  ngOnDestroy(): void {
    if (this.channel) {
      this.channel.unbind_all();  // Unbind all events from the channel
      this.pusherClient.unsubscribe('gestion-procan');  // Unsubscribe from the channel
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
